// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

import {PriceConverter} from "./PriceConverter.sol";
import {ICertifier} from "./ICertifier.sol";

/**
 * @title Certifier
 * @author Spyros Zikos
 * 
 * @notice This is a smart contract that allows certifiers to create exams and
 * users to get certified with NFT certificates.
 * @notice Prevents users from seeing other students' answers until they claim their NFT certificate.
 * @notice Prevents frontrunning attacks when users try to claim their NFT certificate.
 * 
 * System operates in stages. 
 * - Stage 1: The exam is created and users can submit their answers
 *     until the exam exceeds the date set by the certifier.
 * - Stage 2: The exam is corrected by the certifier and the users can't submit their answers anymore.
 * - Stage 3: The users can claim their NFT certificate or their refund depending on whether  
 *     the certifier corrected the exam in time.
 */
contract Certifier is ICertifier, ERC721, ReentrancyGuard, Ownable {
    using Strings for uint256;
    using Strings for address;
    using Strings for string;

    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/
    
    // Fee Collector
    address private s_feeCollector;

    // Certifier
    mapping(address certifier => uint256[] examIds) private s_certifierToExamIds;

    // User
    address[] private s_users;
    mapping(address user => mapping(uint256 examId => bytes32 hashedAnswer)) private s_userToAnswers;
    // user can claim either ether if exam is cancelled or NFT if exam has ended
    mapping(address user => mapping(uint256 examId => bool hasClaimed)) private s_userHasClaimed;

    // Exam
    mapping(uint256 id => Exam exam) private s_examIdToExam;
    uint256 private s_timeToCorrectExam = 5*60; // 5 minutes;
    uint256 private s_lastExamId; // starts from 0
    uint256 private s_examCreationFee = 2 ether; // 2 dollars
    uint256 private s_submissionFee = 0.05 ether; // 5%;

    // NFT
    uint256 private s_tokenCounter;
    mapping(uint256 => string) private s_tokenIdToUri;

    // usernames
    mapping(address user => string username) private s_userToUsername;
    mapping(string username => address user) private s_usernameToUser;

    // Chainlink Price Feed address
    address private immutable i_priceFeed;

    // Decimals
    uint256 private constant DECIMALS = 1e18;

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(address priceFeed) ERC721("Certificate", "CERT") Ownable(msg.sender) {
        s_feeCollector = msg.sender;
        i_priceFeed = priceFeed;
    }

    /*//////////////////////////////////////////////////////////////
                          EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Creates a new exam
     * @param name The name of the exam
     * @param description The description of the exam
     * @param endTime The time the exam ends (unix timestamp)
     * @param questions The questions of the exam
     * @param price The cost of the exam for each student
     */
    function createExam(
        string memory name,
        string memory description,
        uint256 endTime,
        string[] memory questions,
        uint256 price,
        uint256 baseScore,
        string memory imageUrl
    ) external payable {
        if (keccak256(abi.encode(name)) == keccak256(abi.encode(""))) revert Certifier__NameCannotBeEmpty();
        uint256 ethAmountRequired = getUsdToEthRate(s_examCreationFee);
        if (msg.value < ethAmountRequired) revert Certifier__NotEnoughEther(msg.value, ethAmountRequired);
        if (baseScore > questions.length) revert Certifier__BaseScoreExceedsNumberOfQuestions();
        if (endTime < block.timestamp) revert Certifier__EndTimeIsInThePast(endTime, block.timestamp);

        Exam memory exam = Exam({
            id: s_lastExamId,
            name: name,
            description: description,
            endTime: endTime,
            status: Status.Started,
            questions: questions,
            answers: new uint256[](0),
            price: price,
            baseScore: baseScore,
            imageUrl: imageUrl,
            users: new address[](0),
            etherAccumulated: 0,
            certifier: msg.sender
        });

        transferEther(s_feeCollector, msg.value);

        emit CreateExam(
            exam.id,
            exam.name,
            exam.description,
            exam.endTime,
            exam.status,
            exam.questions,
            exam.answers,
            exam.price,
            exam.baseScore,
            exam.imageUrl,
            exam.users,
            exam.etherAccumulated,
            exam.certifier
        );

        s_examIdToExam[s_lastExamId] = exam;
        s_certifierToExamIds[msg.sender].push(s_lastExamId);
        s_lastExamId++;
    }

    /**
     * @notice Submits the answers of the user.
     * @notice The user has to pay the price of the exam.
     * @notice The user can only submit answers before the exam ends.
     * @notice The user can only submit answers once.
     * @param examId The id of the exam
     * @param hashedAnswer The hash of the answers and the key and msg.sender
     */
    function submitAnswersPaid(uint256 examId, bytes32 hashedAnswer) external payable {
        if (block.timestamp > s_examIdToExam[examId].endTime) revert Certifier__ExamEnded(examId);
        if (s_userToAnswers[msg.sender][examId] != "") revert Certifier__UserAlreadySubmittedAnswers(examId);
        if (s_examIdToExam[examId].price == 0) revert Certifier__ThisExamIsNotPaid(examId);
        if (msg.sender == s_examIdToExam[examId].certifier) revert Certifier__CertifierCannotSubmit(examId);
        uint256 ethAmountRequired = getUsdToEthRate(s_examIdToExam[examId].price);
        if (msg.value < ethAmountRequired) revert Certifier__NotEnoughEther(msg.value, ethAmountRequired);

        uint256 feeAmount = msg.value * s_submissionFee / DECIMALS; 
        s_examIdToExam[examId].etherAccumulated += (msg.value - feeAmount);
        transferEther(s_feeCollector, feeAmount);
        s_userToAnswers[msg.sender][examId] = hashedAnswer;

        emit SubmitAnswersPaid(msg.sender, examId, hashedAnswer);
    }

    /**
     * @notice Submits the answers of the user.
     * @notice The exam is free.
     * @notice The user can only submit answers before the exam ends.
     * @notice The user can only submit answers once.
     * @param examId The id of the exam
     * @param hashedAnswer The hash of the answers and the key and msg.sender
     */
    function submitAnswersFree(uint256 examId, bytes32 hashedAnswer) external {
        if (block.timestamp > s_examIdToExam[examId].endTime) revert Certifier__ExamEnded(examId);
        if (s_userToAnswers[msg.sender][examId] != "") revert Certifier__UserAlreadySubmittedAnswers(examId);
        if (s_examIdToExam[examId].price > 0) revert Certifier__ThisExamIsNotFree(examId, s_examIdToExam[examId].price);
        if (msg.sender == s_examIdToExam[examId].certifier) revert Certifier__CertifierCannotSubmit(examId);
        
        s_userToAnswers[msg.sender][examId] = hashedAnswer;
        emit SubmitAnswersFree(msg.sender, examId, hashedAnswer);
    }

    /**
    * @notice Corrects the exam
    * @notice Only the certifier can call this function
    * @param examId The id of the exam
    * @param answers The answers of the user in an array
    */
    function correctExam(uint256 examId, uint256[] memory answers) external nonReentrant {
        if (block.timestamp < s_examIdToExam[examId].endTime ||
            block.timestamp > s_examIdToExam[examId].endTime + s_timeToCorrectExam
        ) revert Certifier__NotTheTimeForExamCorrection(examId);
        if (s_examIdToExam[examId].status == Status.Ended) revert Certifier__ExamAlreadyEnded(examId);
        if (msg.sender != s_examIdToExam[examId].certifier) revert Certifier__OnlyCertifierCanCorrect(examId);

        s_examIdToExam[examId].answers = answers;
        s_examIdToExam[examId].status = Status.Ended;

        uint256 ethToCollect = s_examIdToExam[examId].etherAccumulated;
        if (ethToCollect > 0) {
            transferEther(msg.sender, ethToCollect);
            s_examIdToExam[examId].etherAccumulated = 0;
        }

        emit CorrectExam(examId, answers);
    }

    /**
    * @notice Cancels the exam
    * @notice Anyone can call this function
    * @param examId The id of the exam
    */
    function cancelUncorrectedExam(uint256 examId) external {
        if (s_examIdToExam[examId].status == Status.Cancelled) revert Certifier__ExamIsCancelled(examId);
        if (s_examIdToExam[examId].status == Status.Ended) revert Certifier__ExamEnded(examId);
        if (block.timestamp <= s_examIdToExam[examId].endTime + s_timeToCorrectExam) revert Certifier__TooSoonToCancelExam(examId);
        s_examIdToExam[examId].status = Status.Cancelled;

        emit CancelExam(examId);
    }

    /**
    * @notice Claims the NFT certificate
    * @notice The user can only claim their certificate once
    * @notice answers and secretNumber are used to get the exact answers that the user submitted and 
    * to ensure that he was the one who submitted them
    * @param examId The id of the exam
    * @param answers The answers of the user in an array
    * @param secretNumber The secret number of the user
    */
    function claimCertificate(uint256 examId, uint256[] memory answers, uint256 secretNumber) external {
        if (s_examIdToExam[examId].status != Status.Ended) revert Certifier__ExamIsCancelled(examId);
        if (s_userHasClaimed[msg.sender][examId]) revert Certifier__UserAlreadyClaimedNFT(examId);

        uint256 userAnswersAsNumber = getAnswerAsNumber(answers);
        bytes32 expectedHashedAnswer = keccak256(abi.encodePacked(userAnswersAsNumber, secretNumber, msg.sender));
        if (expectedHashedAnswer != s_userToAnswers[msg.sender][examId]) revert Certifier__AnswerHashesDontMatch(expectedHashedAnswer, s_userToAnswers[msg.sender][examId]);

        uint256 score = getScore(s_examIdToExam[examId].answers, answers);
        if (score < s_examIdToExam[examId].baseScore) revert Certifier__UserFailedExam(score, s_examIdToExam[examId].baseScore);

        s_userHasClaimed[msg.sender][examId] = true;

        string memory tokenUri = makeTokenUri(examId, score);
        s_tokenIdToUri[s_tokenCounter] = tokenUri;
        _safeMint(msg.sender, s_tokenCounter);
        emit ClaimNFT(msg.sender, examId, s_tokenCounter);

        s_tokenCounter++;
    }

    /**
    * Refund the price of the cancelled exam to the user (minus submission fee)
    * Only if the exam is paid (price > 0)
    * @param examId The id of the exam
    */
    function refundExam(uint256 examId) external nonReentrant {
        if (s_examIdToExam[examId].status != Status.Cancelled) revert Certifier__ExamIsNotCancelled(examId);
        if (s_userToAnswers[msg.sender][examId] == "") revert Certifier__UserDidNotParticipate(examId);
        if (s_userHasClaimed[msg.sender][examId]) revert Certifier__UserAlreadyClaimedCancelledExam(examId);
        if (s_examIdToExam[examId].price == 0) revert Certifier__ThisExamIsNotPaid(examId);

        uint256 ethAmount = getUsdToEthRate(s_examIdToExam[examId].price);
        uint256 feeAmount = ethAmount * s_submissionFee / DECIMALS;
        transferEther(msg.sender, ethAmount - feeAmount);
        s_userHasClaimed[msg.sender][examId] = true;

        emit ClaimRefund(msg.sender, examId);
    }

    /*//////////////////////////////////////////////////////////////
                           PUBLIC FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    
    // override
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return s_tokenIdToUri[tokenId];
    }

    // chainlink oracle
    function getUsdToEthRate(uint256 usdAmount) public view returns (uint256) {
        uint256 ethToUsd = PriceConverter.getConversionRate(1e18, i_priceFeed);
        uint256 usdToEthRate = 1e18 * DECIMALS / ethToUsd;
        uint256 ethAmount = usdAmount * usdToEthRate / DECIMALS;
        return ethAmount;
    }

    /*//////////////////////////////////////////////////////////////
                          INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    /*//////////////////////////////////////////////////////////////
                           PRIVATE FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function transferEther(address to, uint256 amount) private {
        (bool success,) = to.call{value: amount}("");
        if (!success) revert Certifier__EtherTransferFailed();
    }

    function getAnswerAsNumber(uint256[] memory answers) private pure returns (uint256) {
        uint256 result = 0;
        for (uint256 i = 0; i < answers.length; i++) {
            result += answers[i] * (10 ** i);
        }
        return result;
    }

    function getScore(uint256[] memory correctAnswers, uint256[] memory userAnswers) private pure returns (uint256) {
        if (correctAnswers.length != userAnswers.length) revert Certifier__AnswersLengthDontMatch(correctAnswers.length, userAnswers.length);

        uint256 score = 0;
        for (uint256 i = 0; i < correctAnswers.length; i++)
            if (correctAnswers[i] == userAnswers[i])
                score++;
        return score;
    }

    function makeTokenUri(uint256 examId, uint256 score) private view returns (string memory) {
        string memory tokenId = s_tokenCounter.toString();
        string memory examName = s_examIdToExam[examId].name;
        string memory examDescription = s_examIdToExam[examId].description;
        string memory scoreStr = score.toString();
        string memory numOfQuestions = s_examIdToExam[examId].questions.length.toString();
        string memory base = s_examIdToExam[examId].baseScore.toString();
        string memory certifier = s_examIdToExam[examId].certifier.toHexString();
        string memory imageUrl = s_examIdToExam[examId].imageUrl;

        return string(
            abi.encodePacked(
                _baseURI(),
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            '{"name": "', name(), " #", tokenId,
                            '", "description": "An NFT that represents a certificate.", ',
                            '"attributes":[',
                            '{"trait_type": "exam_name", "value": "', examName, '"}, ',
                            '{"trait_type": "exam_description", "value": "', examDescription, '"}, ',
                            '{"trait_type": "my_score", "value": "', scoreStr, "/", numOfQuestions, '"}, ',
                            '{"trait_type": "exam_base_score", "value": ', base, "}, ",
                            '{"trait_type": "certifier", "value": "', certifier, '"}',
                            '], "image": "', imageUrl, '"}'
                        )
                    )
                )
            )
        );
    }

    /*//////////////////////////////////////////////////////////////
                           GETTER FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function getStatus(uint256 examId) external view returns (Status) {
        if (s_examIdToExam[examId].status == Status.Ended) return Status.Ended; // terminal status
        if (s_examIdToExam[examId].status == Status.Cancelled) return Status.Cancelled; // terminal status
        if (block.timestamp > s_examIdToExam[examId].endTime + s_timeToCorrectExam) return Status.NeedsCancelling;
        if (block.timestamp > s_examIdToExam[examId].endTime) return Status.NeedsCorrection;
        return Status.Started;
    }

    function getFeeCollector() external view returns (address) {
        return s_feeCollector;
    }

    function getCertifierExams(address certifier) external view returns (uint256[] memory) {
        return s_certifierToExamIds[certifier];
    }

    function getUsers() external view returns (address[] memory) {
        return s_users;
    }

    function getUser(uint256 index) external view returns (address) {
        return s_users[index];
    }

    function getUserAnswer(address user, uint256 examId) external view returns (bytes32) {
        return s_userToAnswers[user][examId];
    }

    function getUserHasClaimed(address user, uint256 examId) external view returns (bool) {
        return s_userHasClaimed[user][examId];
    }

    function getExam(uint256 id) external view returns (Exam memory) {
        return s_examIdToExam[id];
    }

    function getLastExamId() external view returns (uint256) {
        return s_lastExamId;
    }

    function getExamCreationFee() external view returns (uint256) {
        return s_examCreationFee;
    }

    function getSubmissionFee() external view returns (uint256) {
        return s_submissionFee;
    }

    function getTimeToCorrectExam() external view returns (uint256) {
        return s_timeToCorrectExam;
    }

    function getTokenCounter() external view returns (uint256) {
        return s_tokenCounter;
    }

    function getUsername(address user) external view returns (string memory) {
        return s_userToUsername[user];
    }

    function getUserFromUsername(string memory username) external view returns (address) {
        return s_usernameToUser[username];
    }

    function getDecimals() external pure returns (uint256) {
        return DECIMALS;
    }

    /*//////////////////////////////////////////////////////////////
                           SETTER FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function setFeeCollector(address feeCollector) external onlyOwner nonReentrant {
        s_feeCollector = feeCollector;
        emit SetFeeCollector(feeCollector);
    }

    function setTimeToCorrectExam(uint256 time) external onlyOwner nonReentrant {
        s_timeToCorrectExam = time;
        emit SetTimeToCorrectExam(time);
    }

    function setExamCreationFee(uint256 fee) external onlyOwner nonReentrant {
        s_examCreationFee = fee;
        emit SetExamCreationFee(fee);
    }

    function setSubmissionFee(uint256 fee) external onlyOwner nonReentrant {
        s_submissionFee = fee;
        emit SetSubmissionFee(fee);
    }

    function setUsername(string memory username) external nonReentrant {
        s_userToUsername[msg.sender] = username;
        s_usernameToUser[username] = msg.sender;
        emit SetUsername(msg.sender, username);
    }
}

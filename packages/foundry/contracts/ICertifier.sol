// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract ICertifier {
    
    /*//////////////////////////////////////////////////////////////
                           TYPE DECLARATIONS
    //////////////////////////////////////////////////////////////*/
    
    enum Status {
        Started,
        NeedsCorrection,  // not used in contract, only externally
        NeedsCancelling,  // not used in contract, only externally
        Cancelled,
        Ended
    }

    struct Exam {
        uint256 id;
        string name;
        string description;
        uint256 endTime;
        Status status;
        string[] questions;
        uint256[] answers;
        uint256 price; // in $
        uint256 baseScore;
        string imageUrl;
        address[] users;
        uint256 etherAccumulated;
        address certifier;
    }

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    event CreateExam(
        uint256 indexed id,
        string name,
        string description,
        uint256 endTime,
        Status status,
        string[] questions,
        uint256[] answers,
        uint256 price,
        uint256 baseScore,
        string imageUrl,
        address[] users,
        uint256 etherAccumulated,
        address certifier
    );
    event SubmitAnswersPaid(address user, uint256 examId, bytes32 hashedAnswer);
    event SubmitAnswersFree(address user, uint256 examId, bytes32 hashedAnswer);
    event CorrectExam(uint256 examId, uint256[] answers);
    event CancelExam(uint256 examId);
    event ClaimNFT(address user, uint256 examId, uint256 tokenId);
    event ClaimRefund(address user, uint256 examId);
    event SetUsername(address user, string username);
    event SetExamCreationFee(uint256 fee);
    event SetTimeToCorrectExam(uint256 time);
    event SetSubmissionFee(uint256 fee);
    event SetFeeCollector(address feeCollector);

    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    error Certifier__ExamEnded(uint256 examId);
    error Certifier__ExamAlreadyEnded(uint256 examId);
    error Certifier__ExamIsCancelled(uint256 examId);
    error Certifier__ExamIsNotCancelled(uint256 examId);
    error Certifier__NotTheTimeForExamCorrection(uint256 examId);
    error Certifier__TooSoonToCancelExam(uint256 examId);
    error Certifier__UserAlreadyClaimedNFT(uint256 examId);
    error Certifier__UserAlreadyClaimedCancelledExam(uint256 examId);
    error Certifier__NotEnoughEther(uint256 amountSent, uint256 examPrice);
    error Certifier__EtherTransferFailed();
    error Certifier__AnswerHashesDontMatch(bytes32 expected, bytes32 actual);
    error Certifier__WrongAnswers(uint256 expected, uint256 actual);
    error Certifier__UserFailedExam(uint256 userScore, uint256 examBaseScore);
    error Certifier__AnswersLengthDontMatch(uint256 correctAnswersLength, uint256 userAnswersLength);
    error Certifier__UserDidNotParticipate(uint256 examId);
    error Certifier__UserAlreadySubmittedAnswers(uint256 examId);
    error Certifier__OnlyCertifierCanCorrect(uint256 examId);
    error Certifier__ThisExamIsNotFree(uint256 examId, uint256 price);
    error Certifier__ThisExamIsNotPaid(uint256 examId);
    error Certifier__CertifierCannotSubmit(uint256 examId);
    error Certifier__BaseScoreExceedsNumberOfQuestions();
    error Certifier__EndTimeIsInThePast(uint256 endTime, uint256 nowTime);
    error Certifier__NameCannotBeEmpty();
}
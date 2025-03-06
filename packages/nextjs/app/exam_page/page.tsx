"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { Box } from "@chakra-ui/react";
import { PageWrapper, Button, Title } from "~~/components";
import { useAccount } from "wagmi";
import { Web3 } from "web3";
import { handleCancelExam, handleClaimCertificate, handleCorrectExam, handleRefundExam, handleSubmitAnswersFree, handleSubmitAnswersPaid } from "./helperFunctions/WriteToContract";
import ExamPageWithMessage from "./_components/ExamPageWithMessage";
import { ExamStage } from "../../types/ExamStage";
import ExamPageWithSubmit from "./_components/ExamPageWithSubmit";

function getId() {
    const searchParams = useSearchParams();
    const id = BigInt(searchParams.get("id")!);
    return id;
}
const ExamPage = () => {
    // const searchParams = useSearchParams();
    const { address } = useAccount();
    // const id = BigInt(searchParams.get("id")!);
    const id = getId();

    const exam: Exam | undefined = useScaffoldReadContract({
        contractName: "Certifier",
        functionName: "getExam",
        args: [id],
    }).data;

    const userHasClaimed = useScaffoldReadContract({
        contractName: "Certifier",
        functionName: "getUserHasClaimed",
        args: [address, id],
    }).data;

    const userAnswer = useScaffoldReadContract({
        contractName: "Certifier",
        functionName: "getUserAnswer",
        args: [address, id],
    }).data;

    const examPriceInEth = useScaffoldReadContract({
        contractName: "Certifier",
        functionName: "getUsdToEthRate",
        args: [BigInt(exam ? exam.price.toString() : 0)],
    }).data;

    const userHashedSubmittedAnswer = useScaffoldReadContract({
        contractName: "Certifier",
        functionName: "getUserAnswer",
        args: [address, id],
    }).data;

    const getTimeToCorrectExam: bigint | undefined = useScaffoldReadContract({
        contractName: "Certifier",
        functionName: "getTimeToCorrectExam",
    }).data;

    const userHasNotParticipated = userAnswer==="0x0000000000000000000000000000000000000000000000000000000000000000";

    const { writeContractAsync: submitAnswersFree } = useScaffoldWriteContract("Certifier");
    const { writeContractAsync: submitAnswersPaid } = useScaffoldWriteContract("Certifier");
    const { writeContractAsync: cancelExam } = useScaffoldWriteContract("Certifier");
    const { writeContractAsync: refundExam } = useScaffoldWriteContract("Certifier");
    const { writeContractAsync: claimCertificate } = useScaffoldWriteContract("Certifier");
    const { writeContractAsync: correctExam } = useScaffoldWriteContract("Certifier");

    const initialAnswers = exam?.questions.map(() => BigInt(0));
    const [answers, setAnswers] = useState<bigint[]>(initialAnswers!);
    const [userPasswordInput, setUserPasswordInput] = useState<string>("");
    const [correctAnswersLength, setCorrectAnswersLength] = useState<number>(-1);

    useEffect(() => {
        if (answers === undefined)
            setAnswers(initialAnswers!);
    }, [initialAnswers]);

    function getAnswerAsNumber(answers: any) {
        let result = BigInt(0);
        for (let i = 0; i < answers.length; i++) {
            result += answers[i] * BigInt(10 ** i);
        }
        return result;
    }

    /*//////////////////////////////////////////////////////////////
                              SUBMIT EXAM
    //////////////////////////////////////////////////////////////*/

    // Get answers, key, address
    const keyLength = 10;
    const answersAsNumber: bigint = answers ? getAnswerAsNumber(answers) : BigInt(0);
    const [randomKey, _] = useState(Math.floor((10**keyLength) * Math.random()));

    const web3 = window.ethereum ? new Web3(window.ethereum) : new Web3();
    const hashedAnswer = address ? web3.utils.soliditySha3(answersAsNumber, randomKey, address) : '0x0';

    const userPassword = String(answersAsNumber) + String(randomKey).padStart(keyLength, '0');



    const currentTimestamp = BigInt(Math.floor(new Date().getTime() / 1000));
    const needsCorrecting = exam && (exam.status === 0 &&
        (BigInt(exam.endTime.toString()) < currentTimestamp));
    const correctionTimePassed = exam && getTimeToCorrectExam && needsCorrecting &&
        (BigInt(exam.endTime.toString()) + BigInt(getTimeToCorrectExam!.toString()) < currentTimestamp);


    const getExamStage = () => {
        if (address === exam?.certifier) {
            if (exam?.status === 2)
                return ExamStage.Certifier_EndStats;
            if (needsCorrecting) {
                if (!correctionTimePassed)
                    return ExamStage.Certifier_Correct;
                return ExamStage.Both_Cancel;
            }
            if (exam?.status === 1)
                return ExamStage.Both_CancelStats;
            return ExamStage.Certifier_Started;
        }
        else {
            if (exam?.status === 2) {
                if (userHasNotParticipated)
                    return ExamStage.User_Details;
                else {
                    if (userHasClaimed)
                        return ExamStage.User_EndStats;
                    return ExamStage.User_ClaimCertificate;
                }
            } else if (exam?.status === 1) {
                if (!userHasClaimed && !userHasNotParticipated && (exam.price>0))
                    return ExamStage.User_ClaimRefund;
                return ExamStage.Both_CancelStats;
            } else if (needsCorrecting) {
                if (!correctionTimePassed)
                    return ExamStage.User_WaitForCorrection;
                return ExamStage.Both_Cancel;
            } else if (exam?.status === 0) {
                if (userHasNotParticipated)
                    return ExamStage.User_StartedNotSubmitted;
                else
                    return ExamStage.User_StartedSubmitted;
            }
        }
    }

    const getExamStageMessage = (stage: any) => {
        switch (stage) {
            case ExamStage.Certifier_Started:
                return "This exam is ongoing!";
            case ExamStage.User_StartedSubmitted:
                return "Your answers are submitted!";
            case ExamStage.User_WaitForCorrection:
                return "This exam is being corrected by the certifier!";
            case ExamStage.Certifier_EndStats:
                return "This exam has ended! View the certifier stats!"; // TODO add stats
            case ExamStage.User_EndStats:
                return "This exam has ended! View your stats!"; // TODO add stats
            case ExamStage.User_Details:
                return "This exam has ended. You did not participate!";
            case ExamStage.Both_CancelStats:
                return "The exam has been cancelled!";
            default:
                return "";
        }
    }

    function getExamStageAction(stage: any) {
        switch (stage) {
            case ExamStage.User_StartedNotSubmitted:
                return <>
                    <Box className="mt-12 mb-8">
                        <div>Your password is {userPassword}. Copy it and store it. You&apos;ll need it to claim your certificate.</div>
                    </Box>
                    <Box>
                        <Button className="ml-0" onClick={() => 
                        {hashedAnswer ?
                            (
                                (exam && (exam.price > 0) && examPriceInEth) ?
                                    handleSubmitAnswersPaid(submitAnswersPaid, id, hashedAnswer, examPriceInEth)
                                    : 
                                    exam && (exam.price === BigInt(0)) && handleSubmitAnswersFree(submitAnswersFree, id, hashedAnswer)
                            ) 
                            : 0
                        }}>Submit</Button>
                    </Box>
                </>;
            case ExamStage.Both_Cancel:
                return <>
                    <Box className="mt-12 mb-8">
                    <div>This exam was not corrected in time. {exam!.price > 0 ? "You can cancel it and get your refund if you've submitted your answers.":""}</div>
                    </Box>
                    <Box>
                        <Button className="ml-0" onClick={() => {handleCancelExam(cancelExam, id)}}>Cancel Exam</Button>
                    </Box>
                </>;
            case ExamStage.Certifier_Correct:
                return <>
                    <Box className="mt-12 mb-8">
                        <div>This exam needs correcting. Please provide the correct answers.</div>
                    </Box>
                    <Box>
                        <Button className="ml-0" onClick={() => {handleCorrectExam(correctExam, id, answers)}}>Correct Exam</Button>
                    </Box>
                </>;
            case ExamStage.User_ClaimRefund:
                return <>
                    <Box className="mt-12 mb-8">
                        <div>You can claim your refund.</div>
                    </Box>
                    <Box>
                        <Button className="ml-0" onClick={() => {handleRefundExam(refundExam, id)}}>Refund Exam</Button>
                    </Box>
                </>;
            case ExamStage.User_ClaimCertificate:
                const key = parseInt(userPasswordInput.substring(userPasswordInput.length - keyLength));
                let answersInt = parseInt(userPasswordInput.substring(0, userPasswordInput.length - keyLength));
                const answersIntCopy = answersInt;
                const answersArray: bigint[] = [];
                for (let i = 0; i < userPasswordInput.length - keyLength; i++) {
                    answersArray.push(BigInt(answersInt % 10));
                    answersInt = Math.floor(answersInt / 10);
                }
                const numberOfCorrectAnswers = answersArray.filter((answer: any, i: any) => answer === exam?.answers[i]).length;

                if (correctAnswersLength > -1) { // if we know the correct answers length
                    return (
                        <Box className="mt-12 mb-8">
                            <div>You failed this exam! Your score was {correctAnswersLength}/{exam!.questions.length} {""}
                                but you needed at least {exam!.baseScore.toString()}/{exam!.questions.length} to pass.</div>
                        </Box>
                    );
                }

                const passwordLengthGood = answersArray.length === exam!.questions.length;
                const hashFromInputedPassword = (answersIntCopy && key && address) ?  web3.utils.soliditySha3(answersIntCopy, key, address) : '0x0';
                const passwordHashGood = hashFromInputedPassword === userHashedSubmittedAnswer;
                return <>
                    <Box className="mt-12 mb-8">
                        <div>You can claim your certificate! To do so, enter your password below.</div>
                    </Box>
                    <input
                        className="border-2 border-blue-400 text-base-content bg-base-100 p-2 mr-2 mb-4 min-w-[200px] sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-accent"
                        type="text"
                        value={userPasswordInput}
                        placeholder="Password"
                        onChange={e => setUserPasswordInput(e.target.value)}
                    />
                    {(passwordLengthGood && passwordHashGood) ?
                    <Box>
                        <Button className="ml-0"
                            onClick={() => {
                                if (numberOfCorrectAnswers < exam!.baseScore)
                                    setCorrectAnswersLength(numberOfCorrectAnswers);
                                else
                                    userPasswordInput ? handleClaimCertificate(claimCertificate, id, answersArray, BigInt(key)) : 0
                        }}>Claim Certificate</Button>
                    </Box>
                    :
                    <Box>
                        <div>Your password is incorrect!</div>
                    </Box>
                    }
                </>;
            default:
                return "";
        }
    }

    const pageDoesAction = () => {
        if ((getExamStage() === ExamStage.User_StartedNotSubmitted) ||
            (getExamStage() === ExamStage.Both_Cancel) ||
            (getExamStage() === ExamStage.Certifier_Correct) ||
            (getExamStage() === ExamStage.User_ClaimRefund) ||
            (getExamStage() === ExamStage.User_ClaimCertificate)) {
            return true;
        }
    }

    if (exam?.certifier === "0x0000000000000000000000000000000000000000") {
        return (
            <PageWrapper>
                <Title>Exam Page</Title>
                <Box>
                    <div>Exam does not exist!</div>
                </Box>
            </PageWrapper>
        )
    }

    return (
        <PageWrapper>
            {/* <Title>Exam Page</Title> */}

            {pageDoesAction() ? 
                <ExamPageWithSubmit
                    exam={exam}
                    answers={answers} 
                    setAnswers={setAnswers} 
                    action={getExamStageAction(getExamStage()!)}
                    showAnswers={
                        (getExamStage() === ExamStage.User_StartedNotSubmitted) ||
                        (getExamStage() === ExamStage.Certifier_Correct)
                    }
                />
            :
                <ExamPageWithMessage exam={exam} message={getExamStageMessage(getExamStage()!)}/>
            }
            
        </PageWrapper>
    )
}

export default ExamPage
import React from "react"
import ExamDetails from "./ExamDetails";
import { Box } from "@chakra-ui/react";

const ExamPageWithSubmit = ({exam, answers, setAnswers, action, showAnswers}:
    {
        exam: Exam|undefined,
        answers: bigint[],
        setAnswers: any,
        action: any,
        showAnswers: boolean
    }) => {
    return (
        <ExamDetails 
            exam={exam}
            questions={
                <Box>
                {exam?.questions.map((question, index) => (
                    <Box key={index}>
                        <form
                            onChange={e => {
                                const target = e.target as HTMLInputElement;
                                if (target.checked) {
                                    const value = Number(target.value);
                                    if (!isNaN(value)) {
                                        setAnswers([
                                            ...answers.slice(0, index),
                                            BigInt(value),
                                            ...answers.slice(index + 1),
                                        ]);
                                    }
                                }
                            }}
                        >
                            <div className="mt-6 mb-2 border-2 border-gray-400 p-2">
                                <div className="whitespace-pre-wrap">{question}</div>
                                {showAnswers &&
                                <>
                                <label className="mr-5 mt-4">
                                    <input type="radio" name={`question-${index}`} value="1" />
                                    <span className="ml-1">1</span>
                                </label>
                                <label className="mr-5">
                                    <input type="radio" name={`question-${index}`} value="2" />
                                    <span className="ml-1">2</span>
                                </label>
                                <label className="mr-5">
                                    <input type="radio" name={`question-${index}`} value="3" />
                                    <span className="ml-1">3</span>
                                </label>
                                <label className="mr-5">
                                    <input type="radio" name={`question-${index}`} value="4" />
                                    <span className="ml-1">4</span>
                                </label>
                                </>}
                            </div>
                        </form>
                    </Box>
                ))}
                </Box>
            }
            callToAction={action}
        />
    )
}

export default ExamPageWithSubmit
import React from 'react'
import ExamDetails from './ExamDetails';
import { Box } from '@chakra-ui/react';

const ExamPageWithMessage = ({exam, message}:
    { exam: Exam|undefined, message: any }) => {
    return (
        <ExamDetails 
            exam={exam}
            questions={
                <Box>
                {exam?.questions.map((question, index) => (
                    <Box key={index}>
                        <div className="mt-6 mb-2 whitespace-pre-wrap border-2 border-gray-400 p-2">{question}</div>
                    </Box>
                ))}
                </Box>
            }
            callToAction={
                <Box className="mt-12 mb-8">
                    <div>{message}</div>
                </Box>
            }
        />
    )
}

export default ExamPageWithMessage
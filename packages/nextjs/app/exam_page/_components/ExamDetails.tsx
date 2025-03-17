import React from "react"
import { VStack, Image } from "@chakra-ui/react";
import ExamDetail from "./ExamDetail";
import { defaultImage } from "~~/utils/constants/constants";
import { getStatusStr } from "~~/utils/StatusStr";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const ExamDetails = ({exam, questions, callToAction}: {exam: Exam|undefined, questions: any, callToAction: any}) => {
    const status: number | undefined = useScaffoldReadContract({
        contractName: "Certifier",
        functionName: "getStatus",
        args: [exam?.id],
    }).data;
    return (
        <VStack>
            <div className="max-w-[400px]">
            <div className="text-[40px] font-bold mb-4 ">{exam?.name}</div>
            <Image src={exam?.imageUrl || defaultImage} alt={"Exam Image"} maxWidth="500px" maxHeight="500px" mb="6" w={350} h={350} objectFit={"cover"}/>
            <ExamDetail name="Description" value={exam?.description} />
            <ExamDetail name="End Time" value={exam?(new Date(Number(exam?.endTime)*1000)).toString() : 0} />
            <ExamDetail name="Status" value={getStatusStr(status)} />
            <ExamDetail name="Price" value={exam?'$'+parseFloat(exam!.price!.toString()) / 1e18 : 0} />
            <ExamDetail name="Base Score" value={exam?.baseScore.toString()} />
            <ExamDetail name="Certifier" value={exam?.certifier} />
            {questions}
            {callToAction}
            </div>
        </VStack>
    );
}

export default ExamDetails
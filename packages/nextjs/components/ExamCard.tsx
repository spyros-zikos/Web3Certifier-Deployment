import React from "react";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import { Button, Card, EtherInput } from "~~/components";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useRouter } from "next/navigation";
import { Address } from "~~/components/scaffold-eth";

interface CardProps {
    className?: string;
    id: bigint;
    searchTerm: string;
}

const ExamCard: React.FC<CardProps> = ({ className, id, searchTerm = "" }) => {
    const router = useRouter();
    
    const exam: Exam | undefined = useScaffoldReadContract({
        contractName: "Certifier",
        functionName: "getExam",
        args: [BigInt(id)],
    }).data;

    const endDate = exam && new Date(Number(exam.endTime.toString()) * 1000);
    
    let dataString = "";
    if (exam)
        for (const [_, value] of Object.entries(exam!)) {
            dataString += `${value}`;
        }

    const needsCorrecting = exam && (exam.status === 0 &&
        (BigInt(exam.endTime.toString()) < BigInt(Math.floor(new Date().getTime() / 1000))));

    const getFormattedDate = () => {
        const splittedDate = endDate?.toLocaleString().split(",")!;

        const date = splittedDate[0].slice(0,-4) + splittedDate[0].slice(-2);
        const time = (endDate?.toLocaleString().slice(-2)==="AM" ?
            (
                Number(splittedDate[1].slice(0, -9)) === 12
                ? ("00" + splittedDate[1].slice(3, -3))
                : splittedDate[1].slice(0, -3)
            )
            :
            (
                Number(splittedDate[1].slice(0, -9)) === 12
                ? splittedDate[1].slice(0, -3)
                : ((Number(splittedDate[1].slice(0, -9)) + 12).toString()
                    + splittedDate[1].slice(-9, -3))
            )
        ).slice(0,-3);

        return date+'\n'+time;
    }

    return (
        exam?.name &&
        dataString.includes(searchTerm) && (
        <Card
            title={exam?.name}
            className={`${className || ""}`}
            imageUrl={exam?.imageUrl}
            footer={
                <Button className="w-full" onClick={()=>{router.push(`/exam_page?id=${id}`);}}>
                    Explore
                </Button>
            }
            compact={true}
        >
            {/* {exam.description} */}
            <SimpleGrid columns={2} gap={0}>
                <Box>
                    <Text fontSize="12" p="0" m="0" mt="3">Price</Text>
                </Box>
                <Box>
                    <Text fontSize="12" p="0" m="0" mt="3">Status</Text>
                </Box>

                <Box fontWeight="bold">
                    ${parseFloat(exam.price.toString())/1e18}
                </Box>
                <Box fontWeight="bold" w="120px">
                    {
                    needsCorrecting ? "Needs Correcting" :
                        exam.status === 0 ? "Started" :
                        exam.status === 1 ? "Cancelled" :
                        "Ended"
                    }
                </Box>

                <Box>
                    <Text fontSize="12" p="0" m="0" mt="3">End Time</Text>
                </Box>
                <Box>
                    <Text fontSize="12" p="0" m="0" mt="3">Certifier</Text>
                </Box>

                <Box fontWeight="bold">
                    { getFormattedDate() }
                </Box>
                <Box fontWeight="bold">
                    <Address address={exam.certifier.toString()} />
                </Box>
            </SimpleGrid>
        </Card>
        )
    );
};

export default ExamCard;
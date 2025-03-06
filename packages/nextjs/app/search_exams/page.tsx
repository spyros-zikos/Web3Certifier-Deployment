"use client";

import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { Title } from "~~/components";
import React, { useEffect, useState } from "react";
import { SearchBar } from "./_components/SearchBar";
import { useAccount } from "wagmi";
import { ExamCard, PageWrapper } from "~~/components";
import { gql, request } from 'graphql-request';
import { graphUrl } from "~~/utils/constants/constants";

const SearchExamsPage: React.FC = () => {
    const { address } = useAccount();
    const [searchTerm, setSearchTerm] = useState("");
    const [myExamIds, setMyExamIds] = useState<string[]>();
    const [showMyExams, setShowMyExams] = useState(false);

    const { data: lastExamId } = useScaffoldReadContract({
        contractName: "Certifier",
        functionName: "getLastExamId",
    });

    const examIds = [];
    for (let i = 0; i < (lastExamId || 0); i++) {
        examIds.push(i);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const query = gql`{
                    submitAnswersPaids(where: {
                        user: "${address}"
                    }) {
                        user
                        examId
                    }
                    submitAnswersFrees(where: {
                        user: "${address}"
                    }) {
                        user
                        examId
                    }
                }`;
                const response: any = await request(graphUrl, query);
                const data = await response;
                const paidTokenIdList = data.submitAnswersPaids;
                const freeTokenIdList = data.submitAnswersFrees;
                const paidTokenIds = paidTokenIdList.map((tokenIdObject: any) => tokenIdObject["examId"]);
                const freeTokenIds = freeTokenIdList.map((tokenIdObject: any) => tokenIdObject["examId"]);
                const tokenIds = [...paidTokenIds, ...freeTokenIds];
                console.log("tokenIds:", tokenIds);
                setMyExamIds(tokenIds);
            } catch (error) {
                console.log('Error fetching data:', error);
            }
        };
        if (address) fetchData();
    }, [address]);

    return (
        <PageWrapper>
            <Title>Explore Exams</Title>
            <SearchBar setSearchTerm={setSearchTerm} /> {/*To fix border colors*/}
            <div className="mb-16 mt-2 w-full flex items-center justify-start">
                <label className="pb-[3px] mr-2">My Exams</label>
                <input
                    checked={showMyExams}
                    type="checkbox"
                    onChange={(e: any) => { setShowMyExams(e.target.checked); }}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 space-14">
                {(showMyExams?myExamIds:examIds)?.map((id, i) => (
                <ExamCard key={i} id={BigInt(id)} searchTerm={searchTerm} />
                ))}
            </div>
        </PageWrapper>
    );
};

export default SearchExamsPage;
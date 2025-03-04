"use client";

import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { Title } from "~~/components";
import React, { useState } from "react";
import { SearchBar } from "./_components/SearchBar";
// import { useAccount } from "wagmi";
import { ExamCard, PageWrapper } from "~~/components";

const SearchExamsPage: React.FC = () => {
    // const { address } = useAccount();
    const [searchTerm, setSearchTerm] = useState("");

    const { data: lastExamId, refetch } = useScaffoldReadContract({
        contractName: "Certifier",
        functionName: "getLastExamId",
    });

    const examIds = [];
    for (let i = 0; i < (lastExamId || 0); i++) {
        examIds.push(i);
    }

    return (
        <PageWrapper>
            <Title>Explore Exams</Title>
            <SearchBar setSearchTerm={setSearchTerm} /> {/*To fix border colors*/}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 space-14">
                {examIds?.map((id, i) => (
                <ExamCard key={i} id={BigInt(id)} searchTerm={searchTerm} />
                ))}
            </div>
        </PageWrapper>
    );
};

export default SearchExamsPage;
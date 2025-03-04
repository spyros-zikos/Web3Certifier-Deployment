"use client";

import React, { useState } from "react";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { Box } from "@chakra-ui/react";
import { PageWrapper, Button, Title } from "~~/components";
import { useAccount } from "wagmi";

const Page = () => {
    const { address } = useAccount();
    const [ username, setTheUsername ] = useState<string>('')
    const { writeContractAsync: setUsername } = useScaffoldWriteContract("Certifier");

    const storedUsername = useScaffoldReadContract({
        contractName: "Certifier",
        functionName: "getUsername",
        args: [address],
    }).data;

    return (
        <PageWrapper>
            <Title>Connect Your X Account</Title>

            <Box>
                {storedUsername && `Your X Username: ${storedUsername}`}
                <div className="mt-6 mb-2">Set new X username:</div>
                <input 
                    type="text"
                    onChange={e => {
                        setTheUsername(e.target.value);
                    }
                }/>
            </Box>
            <Button className="ml-0" onClick={ async () => {
                await setUsername({
                    functionName: "setUsername",
                    args: [username]
                }, {
                    onBlockConfirmation: (res: any) => {
                        console.log("block confirm", res);
                    },
                });
            }}>Submit</Button>
        </PageWrapper>
    );
}

export default Page
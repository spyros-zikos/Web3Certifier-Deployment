"use client";

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { Button, PageWrapper, Title } from "~~/components";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

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
            <Title>Connect Your Discord Account</Title>

            <Box>
                {storedUsername && `Your Discord Username: ${storedUsername}`}
                <div className="mt-6 mb-2">Set new Discord username:</div>
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

            <p className="mt-6">Join the Discord server to communicate with the AI Agent <a href="https://discord.gg/Za9B5DxuBw" target="_blank"><u>here</u></a>.</p>
        </PageWrapper>
    );
}

export default Page;

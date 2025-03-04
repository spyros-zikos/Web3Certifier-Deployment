import { generateText, IAgentRuntime, Memory, messageCompletionFooter, ModelClass, Provider, State, stringToUuid } from "@elizaos/core";
import { gql, request } from 'graphql-request';
import { ethers } from 'ethers';
import { ABI } from "../ABI.ts";
import { Certification } from "../types.ts";
import { promptExamId, promptRecommendationExplanation, promptUserWantsRecommendation } from "../prompts.ts";
import { getTweetsStringFromUser, getUserUsernameFromMessage, processTweet, getExamsStringFromGraph } from "../helpers.ts";

const provider = new ethers.AlchemyProvider(parseInt(process.env.CHAIN_ID), process.env.ALCHEMY_API_KEY);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ABI, provider )

const examsProvider: Provider = {
    get: async (_runtime: IAgentRuntime, _message: Memory, _state?: State) => {
        if (_message.agentId == _message.userId) return;
        const message = _message.content.text;

        // get mentioned user's twitter username
        const userUsername = getUserUsernameFromMessage(message);
        console.log("userUsername:", userUsername);
        if (!userUsername) return "";
        
        // if (!userUsername) {
        //     const agentUsername = _state.actorsData.find((e: any) => e.id==_message.agentId).username;
        //     // const agentUsername = "web3certifier";
        //     const giveRecommendation = await promptUserWantsRecommendation(_runtime, message, agentUsername);
        //     console.log("giveRecommendation:", giveRecommendation);
        //     if (giveRecommendation === 'yes') return "\n# IMPORTANT INSTRUCTION: Your response should be very short and end with an exclamation mark.";
        //     return "";
        // }

        // if (!userUsername) {
        //     // const agentUsername = _state.actorsData.find((e: any) => e.id==_message.agentId).username;
        //     const agentUsername = "web3certifier";
        //     const giveRecommendation = await promptUserWantsRecommendation(_runtime, message, agentUsername);
        //     console.log("giveRecommendation:", giveRecommendation);
        //     if (giveRecommendation === 'no') return "";

        //     // TODO
        //     // const senderUsername = _state.actorsData.find((e: any) => e.id==_message.userId).username;
        //     const senderUsername = "testthechar22";
        //     const tweetsString = await getTweetsStringFromUser(senderUsername);

        //     const examsString = await getExamsStringFromGraph();

        //     const examId = await promptExamId(_runtime, tweetsString, examsString);
        //     console.log("examId:", examId);

        //     const examName = examsString.split("\n").find((e: string) => e.includes(examId)).split(": ")[1];
        //     console.log("examName:", examName);

        //     const recommendationExplanation = await promptRecommendationExplanation(_runtime, tweetsString, examName);
        //     console.log("recommendationExplanation:", recommendationExplanation);

        //     return "# IMPORTANT INSTRUCTION: IGNORE THE USER'S MESSAGE.\n\n" + "# IMPORTANT INSTRUCTION: RECOMMEND TO THE USER THIS EXAM: " + examName + "\n\n" + "# IMPORTANT INSTRUCTION: PROVIDE THE EXPLANATION FOR THE RECOMMENDATION:\n" + recommendationExplanation;
        // }

        // try 5 times
        for (let i = 0; i < 5; i++) 
            try {
                // get user's address from username
                const userAddress = await contract.getUserFromUsername(userUsername)
                console.log("userAddress:", userAddress);

                // get user's certificates
                const query = gql`{
                    claimNFTs(where: {
                        user: "${userAddress}"
                    }) {
                        tokenId
                    }
                }`;
                const url = 'https://api.studio.thegraph.com/query/103564/web3certifier-sepolia/version/latest';
                const response: any = await request(url, query);
                const data = await response;
                const tokenIdList = data.claimNFTs;
                const tokenIds = tokenIdList.map((tokenIdObject: any) => tokenIdObject["tokenId"]);
                console.log("tokenIds:", tokenIds);

                // get tokenURI for each certificate
                let tokenURIs: string[] = [];
                for (const tokenId of tokenIds) {
                    const tokenURI: string = await contract.tokenURI(tokenId);
                    tokenURIs.push(tokenURI);
                }

                // get name, description, base and score for certifications of the user
                const certifications: Certification[] = tokenURIs.map((tokenURI: string) => {
                    const encodedMetadata = tokenURI.split(",")[1];
                    const metadata = atob(encodedMetadata);
                    console.log(metadata);
                    const metadataObject = JSON.parse(metadata);
                    const attributes = metadataObject["attributes"];
                    const name = attributes.find((attribute: any) => attribute["trait_type"] === "exam_name")["value"];
                    const description = attributes.find((attribute: any) => attribute["trait_type"] === "exam_description")["value"];
                    const base = attributes.find((attribute: any) => attribute["trait_type"] === "exam_base_score")["value"];
                    const score = attributes.find((attribute: any) => attribute["trait_type"] === "my_score")["value"];
                    const certification: Certification = { name, description, base, score };
                    return certification;
                });
                console.log(certifications);
                
                // format certification data
                const formattedCertifications = certifications.map((certification: Certification) => {
                    const { name, description, base, score } = certification;
                    return `Name: "${name}"\nDescription: "${description}"\nBase Score: ${base}\nScore: ${score}`
                })
                const formattedCertificationData = 
                    "# INSTRUCTION:\nIf the user asks anything related to the skills or abilities or certifications or knowledge of a user then use the following certifications that the user has acquired. You should not tell directly what the certifications are unless the user asks directly but use the certifications to draw conclusions about the user's skills or abilities or knowledge. The certifications are:\n\n"
                    + formattedCertifications.join("\n\n");
                console.log("formattedCertificationData: ", formattedCertificationData);
                return formattedCertificationData;
            } catch (error) {
                console.log(error);
            }
    },
};
export { examsProvider };
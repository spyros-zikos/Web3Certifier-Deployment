import { composeContext, elizaLogger, generateText, stringToUuid } from "@elizaos/core";
import { generateMessageResponse, generateTrueOrFalse } from "@elizaos/core";
import { booleanFooter, messageCompletionFooter } from "@elizaos/core";
import {
    Action,
    ActionExample,
    Content,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    ModelClass,
    State,
} from "@elizaos/core";
import { getExamsStringFromGraph, getTweetsStringFromUser, getUserUsernameFromMessage } from "../helpers.ts";
import { promptExamId, promptRecommendationExplanation, promptUserWantsRecommendation } from "../prompts.ts";

export const recommendationAction: Action = {
    name: "RECOMMEND",
    similes: ["PROPOSE", "SUGGEST"],
    description: "Recommend to the user a certificate or an exam.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: any,
        callback: HandlerCallback
    ) => {
        /*
        // const agentUsername = _state.actorsData.find((e: any) => e.id==_message.agentId).username;
        const agentUsername = "web3certifier";
        const giveRecommendation = await promptUserWantsRecommendation(runtime, message.content.text, agentUsername);
        console.log("giveRecommendation:", giveRecommendation);
        if (giveRecommendation === 'no') return "";
        */

        // TODO
        // const senderUsername = _state.actorsData.find((e: any) => e.id==_message.userId).username;
        const senderUsername = "testthechar22";
        const tweetsString = await getTweetsStringFromUser(senderUsername);

        const examsString = await getExamsStringFromGraph();

        const examId = await promptExamId(runtime, tweetsString, examsString);
        console.log("examId:", examId);

        const examName = examsString.split("\n").find((e: string) => e.includes(examId)).split(": ")[1];
        console.log("examName:", examName);

        const recommendationExplanation = await promptRecommendationExplanation(runtime, tweetsString, examName);
        console.log("recommendationExplanation:", recommendationExplanation);

        const responseWithExplanation = recommendationExplanation;
        // callback({text: responseWithExplanation});

        const responseWithLink = "\n-> web3certifier.com/exams/" + examId;

        const response = responseWithExplanation + responseWithLink;
        callback({ text: response });
        
        return;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Can you recommend an exam?",
                },
            },
            {
                user: "web3certifier",
                content: { text: "", action: "RECOMMEND" },
            },
        ],
    ] as ActionExample[][],
} as Action;
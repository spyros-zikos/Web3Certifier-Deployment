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
// import { getExamsStringFromGraph, getTweetsStringFromUser, getUserUsernameFromMessage } from "../helpers.ts";
import { promptExamId, promptInterestsFromMessage, promptRecommendationExplanation, promptUserWantsRecommendation } from "../prompts.ts";
import { getExamsStringFromGraph } from "../helpers.ts";
import { Client, GatewayIntentBits, Partials } from 'discord.js';

export const recommendationAction: Action = {
    suppressInitialMessage: true,
    name: "RECOMMEND",
    similes: ["PROPOSE", "SUGGEST"],
    description: "Recommend to the user a certificate or an exam after they tell you what they are interested in.",
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
        // This action is used when the user provides his interest in a subject or topic.
        // The agent will then recommend a certificate or an exam based on the user's interest.

        // ---------delete prev msg------------

        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ],
            partials: [Partials.Message, Partials.Channel, Partials.GuildMember]
        });
        
        client.once('ready', () => {
            console.log(`Logged in as ${client.user.tag}`);
        });
        
        client.on('messageCreate', async (message) => {
            if (message.content === '!deletebotmsg') {
                try {
                    const channel = message.channel;
        
                    // Fetch messages from the channel (limit 20 to ensure we get recent ones)
                    const messages = await channel.messages.fetch({ limit: 20 });
        
                    // Find the most recent message sent by *this* bot
                    const botMessage = messages.find(msg => msg.author.id === client.user.id);
        
                    if (botMessage) {
                        await botMessage.delete();
                        message.reply('✅ Last bot message deleted!');
                    } else {
                        message.reply('⚠ No recent bot messages found!');
                    }
                } catch (error) {
                    console.error('Error deleting bot message:', error);
                    message.reply('❌ An error occurred while trying to delete the message.');
                }
            }
        });
        
        client.login(process.env.DISCORD_API_TOKEN);

        // ---------delete prev msg------------

        // Get interests from message
        const interestsString = await promptInterestsFromMessage(runtime, message.content.text);

        // Get active exams
        const examsString = await getExamsStringFromGraph();

        // Find id of best active exam
        const examId = await promptExamId(runtime, interestsString, examsString);
        console.log("examId:", examId);

        // Get exam name
        const examName = examsString.split("\n").find((e: string) => e.includes(examId)).split(": ")[1];
        console.log("examName:", examName);

        // Get recommendation explanation
        const recommendationExplanation = await promptRecommendationExplanation(runtime, interestsString, examName);
        console.log("recommendationExplanation:", recommendationExplanation);

        const url = "\n>> https://web3-certifier-deployment-nextjs-git-main-spyros-zikos-projects.vercel.app/exam_page?id=";
        const responseWithLink = url + examId;

        const response = recommendationExplanation + responseWithLink;
        callback({ text: response });
        
        return;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "I'm interested in physics",
                },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "RECOMMEND" },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "I like mathematics",
                },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "RECOMMEND" },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Recommend me a blockchain course",
                },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "RECOMMEND" },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Recommend me a course",
                },
            },
            {
                user: "{{user2}}",
                content: { text: "Please specify what you're interested in.", action: "NONE" },
            },
        ],
    ] as ActionExample[][],
} as Action;
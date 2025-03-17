import { Scraper } from 'agent-twitter-client';
import { gql, request } from 'graphql-request';

// GET USERNAME FROM MESSAGE

function processUsername(unprocessedUsername: string) {
    let username = unprocessedUsername;
    const symbols = [' ', '.', '!', '?', ':', ';', ',', '<', '>', '\n', '\r', '\t'];
    for (let i = 0; i < symbols.length; i++) {
        username = username.split(symbols[i])[0];
    }
    return username
}

export function getDiscordIdFromMessage(message: string) {
    const agentDiscordId = process.env.AGENT_DISCORD_ID;
    const ids = message.split("@");
    const processedIds = ids.map(processUsername);
    const idsWithoutAgent = processedIds.filter((e,i)=>(e!==agentDiscordId&&i!=0));

    const numOfIds = idsWithoutAgent.length;
    console.log("message:", message);
    console.log("ids:", idsWithoutAgent);
    if (numOfIds === 0 || numOfIds === 2) return;

    return idsWithoutAgent[0];
}

// GRAPH QUERIES

export async function getExamsStringFromGraph() {
    // Get open certificate names and ids
    const query = gql`{
        createExams(where: {
            endTime_gt: "${Math.floor(Date.now()/1000)}"
        }) {
            internal_id
            name
        }
    }`;
    const response: any = await request(process.env.THE_GRAPH_URL, query);
    const data = await response;
    const examsList = data.createExams;
    const exams = examsList
        .map((examObject: any) => `${examObject["internal_id"]}: ${examObject["name"]}`);
    const examsString = exams.join("\n");
    console.log("\nexams:\n", examsString);
    return examsString;
}
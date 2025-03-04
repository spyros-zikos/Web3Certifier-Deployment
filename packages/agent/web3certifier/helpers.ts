import { Scraper } from 'agent-twitter-client';
import { gql, request } from 'graphql-request';

// GET USERNAME FROM MESSAGE

function processUsername(unprocessedUsername: string) {
    let username = unprocessedUsername;
    const symbols = [' ', '.', '!', '?', ':', ';', ','];
    for (let i = 0; i < symbols.length; i++) {
        username = username.split(symbols[i])[0];
    }
    return username
}

export function getUserUsernameFromMessage(message: string) {
    const agentUsername = process.env.TWITTER_USERNAME;
    const usernames = message.split("@");
    const processedUsernames = usernames.map(processUsername);
    const usernamesWithoutAgent = processedUsernames.filter((e,i)=>(e!==agentUsername&&i!=0));

    const numOfUsernames = usernamesWithoutAgent.length;
    console.log("message:", message);
    console.log("usernames:", usernamesWithoutAgent);
    if (numOfUsernames === 0 || numOfUsernames === 2) return;

    return usernamesWithoutAgent[0];
}

// GET USER TWEETS

export function processTweet(tweet: string) {
    let processedTweet = "";
    tweet.split("<").forEach(line => {
        const parts = line.split(">")
        if (parts.length > 1) {
            processedTweet += parts[1];
        } else {
            processedTweet += line;
        }
    })
    return processedTweet;
}

export async function getTweetsStringFromUser(senderUsername: string) {
    // Get tweets
    const scraper = new Scraper();
    await scraper.login(
        process.env.TWITTER_USERNAME,
        process.env.TWITTER_PASSWORD,
        process.env.TWITTER_EMAIL
    );
    const NUMBER_OF_TWEETS_TO_FETCH = 5;
    const tweets = scraper.getTweets(senderUsername, NUMBER_OF_TWEETS_TO_FETCH);
    // Format tweets
    let counter = 1;
    let tweetsString = "";
    while (true) {
        const tweet = await tweets.next();
        if (tweet.done) break;
        const unprocessedTweet = tweet.value.html;
        const processedTweet = processTweet(unprocessedTweet);
        tweetsString += "TWEET " + counter + ":\n" + processedTweet + "\n\n";
        counter++;
    }
    console.log("\ntweetsString:\n", tweetsString);
    return tweetsString;
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
    const url = 'https://api.studio.thegraph.com/query/103564/web3certifier-sepolia/version/latest';
    const response: any = await request(url, query);
    const data = await response;
    const examsList = data.createExams;
    const exams = examsList
        .map((examObject: any) => `${examObject["internal_id"]}: ${examObject["name"]}`);
    const examsString = exams.join("\n");
    console.log("\nexams:\n", examsString);
    return examsString;
}
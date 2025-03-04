import { generateText, IAgentRuntime, ModelClass } from "@elizaos/core";


export async function promptUserWantsRecommendation(_runtime: IAgentRuntime, message: string, agentUsername: string) {
    const contextUserWantsRecommendation = `Your job is to answer 'yes' or 'no'. This answer depends on whether the user wants to get exam or certificate recommendations or proposals or not.

Here are some examples:

message: @${agentUsername}
your response: no

message: @${agentUsername} hi!
your response: no

message: exam @${agentUsername}
your response: no

message: @${agentUsername} This certificate is great.
your response: no

message: I love certificates  @${agentUsername}
your response: no

message: How are you? @${agentUsername} I took an exam!!!
your response: no

message: Very good guy @${agentUsername}!
your response: no

message: Awesome exam @${agentUsername}
your response: no

message: Could you recommend some certificates @${agentUsername}
your response: yes

message: Can you propose some certificates? @${agentUsername}
your response: yes

message: @${agentUsername} Are there any certificates I could take?
your response: yes

message: I love certificates @${agentUsername}! Can you recommend one?
your response: yes

message: Is there any certificate I could take @${agentUsername}?
your response: yes

message: Are there certificates suitable for me? @${agentUsername}
your response: yes

message: Hi there! @${agentUsername} Are there any certificates for me?
your response: yes

message: Could you recommend some exams @${agentUsername}
your response: yes

message: Can you propose some exams? @${agentUsername}
your response: yes

message: @${agentUsername} Are there any exams I could take?
your response: yes

message: I love exams @${agentUsername}! Can you recommend one?
your response: yes

message: Is there any exam I could take @${agentUsername}?
your response: yes

message: Are there exams suitable for me? @${agentUsername}
your response: yes

message: Hi there! @${agentUsername} Are there any examns for me?
your response: yes

Your job is to answer 'yes' or 'no'. This answer depends on whether the user wants to get exam or certificate recommendations or proposals or not.
Use the above examples as examples to answer to the following message. Also, definitely use common sense to understand if the user want you to recommend an exam or a certificate or not.
The message is:
"""
${message}
"""

Only respond with 'yes' or 'no' depending on whether the user wants a recommendation or not, do not include any other text.`;

    const response = await generateText({
        runtime: _runtime,
        context: contextUserWantsRecommendation,
        modelClass: ModelClass.LARGE,
        stop: ["\n"],
    });

    return response;
}


export async function promptExamId(_runtime: IAgentRuntime, tweetsString: string, examsString: string) {
    const contextExamId = `HERE ARE THE USER's TWEETS:\n
${tweetsString}

HERE ARE THE EXAM IDs AND NAMES:\n
${examsString}

YOUR JOB IS TO ANSWER WITH THE EXAM ID OF THE EXAM THE USER WANTS TO TAKE BASED ON THE EXAM NAME.

YOU CAN UNDERSTAND THE USER'S INTEREST FROM THE ABOVE TWEETS.

YOUR ANSWER MUST BE ONE OF THE EXAM IDs FROM ABOVE. CHOOSE ONLY ONE EXAM ID BASED ON THE USER'S INTEREST. DO NOT INCLUDE ANY OTHER TEXT OTHER THAN THE EXAM ID.
    `;

    const response = await generateText({
        runtime: _runtime,
        context: contextExamId,
        modelClass: ModelClass.LARGE,
        stop: ["\n"],
    });

    return response;
}


export async function promptRecommendationExplanation(_runtime: IAgentRuntime, tweetsString: string, exam: string) {
    const contextRecommendationExplanation = `HERE ARE THE USER's TWEETS:\n
${tweetsString}

EXPLAIN BRIEFLY WHY THE EXAM WITH NAME ${exam} IS WILL BE THE MOST INTERESTING AND USEFUL EXAM FOR THE USER.
USE 'YOU' TO TALK DIRECTLY TO THE USER.
THE ANSWER SHOULD BE LESS THAN 240 CHARACTERS.
`;

    const response = await generateText({
        runtime: _runtime,
        context: contextRecommendationExplanation,
        modelClass: ModelClass.LARGE,
        stop: ["\n"],
    });

    return response;
}

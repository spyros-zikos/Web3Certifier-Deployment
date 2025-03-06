import { gql, request } from 'graphql-request';
import { graphUrl } from "~~/utils/constants/constants";

// Certifier stats after exam correction
// 1. Number of submissions
// 2. Number of correct submissions
// 3. Profit
const getCertifierStatsAfterCorrection = async (exam: Exam) => {
    const id = exam.id;
    let numOfSubmissions = 0;
    let numOfCorrectSubmissions = 0;
    let profit = 0;

    // Get number of submissions
    if (exam.price !== BigInt(0)) {
        // Get number of paid submissions
        try {
            const query = gql`
            { submitAnswersPaids(where: { examId: ${id} }) { user } }`;
            const response: any = await request(graphUrl, query);
            const data = await response;
            const paidSubmissionList = data.submitAnswersPaids;
            numOfSubmissions = paidSubmissionList.length;
        } catch (error) { console.log('Error fetching data:', error); }
    } else {
        // Get number of free submissions
        try {
            const query = gql`
            { submitAnswersFrees(where: { examId: ${id} }) { user } }`;
            const response: any = await request(graphUrl, query);
            const data = await response;
            const freeSubmissionList = data.submitAnswersFrees;
            numOfSubmissions = freeSubmissionList.length;
        } catch (error) { console.log('Error fetching data:', error); }
    }

    // Get number of correct submissions
    try {
        const query = gql`
        { claimNFTs(where: { examId: ${id} }) { user } }`;
        const response: any = await request(graphUrl, query);
        const data = await response;
        const correctSubmissionList = data.claimNFTs;
        numOfCorrectSubmissions = correctSubmissionList.length;
    } catch (error) { console.log('Error fetching data:', error); }

    // Get profit
    if (exam.price !== BigInt(0)) {
        profit = Number(BigInt(numOfCorrectSubmissions) * exam.price / BigInt(1e18));
    }

    const statsText = `--- Statistics ---\nNumber of submissions: ${numOfSubmissions}\nNumber of correct submissions: ${numOfCorrectSubmissions}\nProfit: $${profit}`;
    
    return statsText;
}

export default getCertifierStatsAfterCorrection
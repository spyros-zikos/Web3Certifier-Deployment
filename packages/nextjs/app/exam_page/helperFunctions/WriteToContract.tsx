/*//////////////////////////////////////////////////////////////
                         SUBMIT EXAM PAID
//////////////////////////////////////////////////////////////*/

export const handleSubmitAnswersPaid = async (submitAnswersPaid: any, id: bigint, hashedAnswer: string, examPrice: BigInt) => {
    await submitAnswersPaid({
        functionName: "submitAnswersPaid",
        args: [id, `0x${hashedAnswer?.substring(2)}`],
        value: examPrice
    }, {
        onBlockConfirmation: (res: any) => {
            console.log("block confirm", res);
        },
    });
};

/*//////////////////////////////////////////////////////////////
                         SUBMIT EXAM FREE
//////////////////////////////////////////////////////////////*/

export const handleSubmitAnswersFree = async (submitAnswersFree: any, id: bigint, hashedAnswer: string) => {
    await submitAnswersFree({
        functionName: "submitAnswersFree",
        args: [id, `0x${hashedAnswer?.substring(2)}`]
    }, {
        onBlockConfirmation: (res: any) => {
            console.log("block confirm", res);
        },
    });
};


/*//////////////////////////////////////////////////////////////
                            CANCEL EXAM
//////////////////////////////////////////////////////////////*/

export const handleCancelExam = async (cancelExam: any, id: bigint) => {
    await cancelExam({
        functionName: "cancelUncorrectedExam",
        args: [id],
    }, {
        onBlockConfirmation: (res: any) => {
            console.log("block confirm", res);
        },
    });
};

/*//////////////////////////////////////////////////////////////
                            CORRECT EXAM
//////////////////////////////////////////////////////////////*/

export const handleCorrectExam = async (correctExam: any, id: bigint, answers: bigint[]) => {
    await correctExam({
        functionName: "correctExam",
        args: [id, answers],
    }, {
        onBlockConfirmation: (res: any) => {
            console.log("block confirm", res);
        },
    });
};

/*//////////////////////////////////////////////////////////////
                    REFUND UNSUCCESSFUL EXAM
//////////////////////////////////////////////////////////////*/

export const handleRefundExam = async (refundExam: any, id: bigint) => {
    await refundExam({
        functionName: "refundExam",
        args: [id],
    }, {
        onBlockConfirmation: (res: any) => {
            console.log("block confirm", res);
        },
    });
};


/*//////////////////////////////////////////////////////////////
                        CLAIM CERTIFICATE
//////////////////////////////////////////////////////////////*/

export const handleClaimCertificate = async (claimCertificate: any, id: bigint, answersArray: bigint[], key: bigint) => {
    await claimCertificate({
        functionName: "claimCertificate",
        args: [id, answersArray, key],
    }, {
        onBlockConfirmation: (res: any) => {
            console.log("block confirm", res);
        },
    });
};

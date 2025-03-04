
export enum ExamStage {
    // --- Start --- 
    Certifier_Started,
    User_StartedNotSubmitted, // submit
    User_StartedSubmitted,

    // --- Correction period start --- 
    Certifier_Correct, // submit
    User_WaitForCorrection,

    // --- Exam needs cancelling --- 
    Both_Cancel, // submit

    // --- Exam got cancelled --- 
    User_ClaimRefund, // submit
    Both_CancelStats,
    
    // --- Exam Ended ---
    Certifier_EndStats,
    User_ClaimCertificate, // submit
    User_EndStats, // for participants
    User_Details, // for non-participants

}
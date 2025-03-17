
export function getStatusStr(statusNum: number | undefined) {
    if (statusNum === undefined) return "Undefined";
    return statusNum == 0 ? "Started" 
        : statusNum == 1 ? "Needs Correction"
        : statusNum == 2 ? "Needs Cancelling"
        : statusNum == 3 ? "Cancelled"
        : "Ended";
}
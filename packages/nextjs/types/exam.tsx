interface Exam {
    id: bigint;
    name: string;
    description: string;
    endTime: bigint;
    status: number;
    questions: readonly string[];
    answers: readonly bigint[];
    price: bigint;
    baseScore: bigint;
    imageUrl: string;
    users: readonly string[];
    etherAccumulated: bigint;
    certifier: string;
}
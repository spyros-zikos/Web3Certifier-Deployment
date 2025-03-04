import React from "react";
import { Text } from "@chakra-ui/react";
import { PageWrapper, Button, Title } from "~~/components";

const CancelExamPage = ({onClick}: {onClick:()=>void}) => {
    return (
        <PageWrapper>
            <Title>Exam Page</Title>
            <Text>This exam needs to be cancelled!</Text>
            <Button onClick={onClick}>Cancel Exam</Button>
        </PageWrapper>
    );
}

export default CancelExamPage
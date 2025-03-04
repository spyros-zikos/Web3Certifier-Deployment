import React from "react"
import { Box, Text } from "@chakra-ui/react";

const ExamDetail = ({name, value}: {name: any, value: any}) => {
    return (
        <Box>
            <label className="fontsize-12 mt-4">{name}: </label>
            <Text fontWeight="bold" fontSize="12" p="0" m="0" mb="4">{value}</Text>
        </Box>
    );
}

export default ExamDetail
import {Box} from "@chakra-ui/react";
import React from "react";


export const BorderShadowBox: typeof Box = (props) => {
    //<Box borderWidth="1px" borderRadius="lg" maxW="sm" padding="1vw" _hover={{boxShadow: "lg"}} {...props}>
    return (
        <Box borderWidth="1px" borderRadius="lg" _hover={{boxShadow: "lg"}} {...props}>
            {props.children}
        </Box>
    )

}
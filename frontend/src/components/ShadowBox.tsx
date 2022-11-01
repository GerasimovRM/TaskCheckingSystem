import {Box} from "@chakra-ui/react";


export const ShadowBox: typeof Box = (props) => {
    return (
        <Box borderRadius="lg" _hover={{boxShadow: "lg", borderWidth: 1}} {...props}>
            {props.children}
        </Box>
    )

}
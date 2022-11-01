import {Link} from 'react-router-dom';

import {
    Button,
    Center,
    Divider, HStack,
    LinkBox, SimpleGrid, Spacer,
    Stack,
    Stat,
    Text,
    useColorMode,
    useDisclosure,
    VStack
} from '@chakra-ui/react';
import {BorderShadowBox} from "./BorderShadowBox";
import {ISolution} from "../models/ISolution";
import {ISolutionStatus} from "../models/ITask";
import {useTypedSelector} from "../hooks/useTypedSelector";
import {useActions} from "../hooks/useActions";
import {useEffect} from "react";
import {get_format_date} from "../api/Common";
import {SolutionCheckSystemInfo} from "./SolutionCheckSystemInfo";
import {ISolutionInfo} from "../models/ISolutionInfo";

export const SolutionInfo: (props: ISolutionInfo) => JSX.Element = (props: ISolutionInfo) => {
    const {current_solution} = useTypedSelector(state => state.solution)
    const {setSolution} = useActions()

    const {colorMode} = useColorMode()

    useEffect(() => {
    }, [current_solution])

    return (

        <SimpleGrid m={1}>
            <LinkBox as={"article"}
                     borderWidth={(current_solution && props.id === current_solution.id) ? 3 : 1}
                     borderRadius={10}
                     borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
                     alignItems={"flex-start"}
                     padding={1}
                     onClick={() => {
                         setSolution(props)
                     }}
            >
                <HStack>
                    <VStack divider={<Divider borderColor={colorMode === "dark" ? "white" : "black"}/>} spacing={1}>
                        <Text fontSize='sm' width={"fit-content"}>
                            Решение № {props.id}
                        </Text>

                        <Text fontSize='sm'>
                            {props.time_finish ? get_format_date(props.time_finish) : get_format_date(props.time_start)}
                        </Text>
                    </VStack>
                    <Spacer/>
                    <Text fontSize={"sm"}>
                        {props.score}/{props.max_score}
                    </Text>
                    <Spacer/>
                    <SolutionCheckSystemInfo {...props} key={props.id}/>
                </HStack>
            </LinkBox>
        </SimpleGrid>


    )
        ;
}
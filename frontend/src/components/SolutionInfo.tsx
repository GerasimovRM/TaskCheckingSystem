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
import React, {useContext, useEffect} from "react";
import {get_format_date} from "../api/Common";
import {SolutionCheckSystemInfo} from "./SolutionCheckSystemInfo";
import {ISolutionInfo} from "../models/ISolutionInfo";
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../context';

export const SolutionInfo: (props: ISolutionInfo) => JSX.Element = observer((props: ISolutionInfo) => {
    const RS = useContext(RootStoreContext);
    const {current_solution} = RS.solutionStore;

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
                        RS.solutionStore.setSolution(props);
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
})
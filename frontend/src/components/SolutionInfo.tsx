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

export const SolutionInfo: (props: ISolution) => JSX.Element = (props: ISolution) => {
    const {current_solution} = useTypedSelector(state => state.solution)
    const {setSolution} = useActions()
    const theme = {
        bg: 'gray.500',
        text: 'Не отправлялось',
    };
    if (props.status === ISolutionStatus.ERROR) {
        theme.bg = 'red.500';
        theme.text = 'Доработать';
    } else if (props.status === ISolutionStatus.ON_REVIEW) {
        theme.bg = 'yellow.500';
        theme.text = 'На проверке';
    } else if (props.status === ISolutionStatus.COMPLETE_NOT_MAX) {
        theme.bg = 'green.300'
        theme.text = 'Зачтено'
    } else if (props.status === ISolutionStatus.COMPLETE) {
        theme.bg = 'green.600'
        theme.text = 'Зачтено'
    }
    const {colorMode} = useColorMode()

    useEffect(() => {
    }, [current_solution])

    return (

        <SimpleGrid m={1}>
            <LinkBox as={"article"}
                     borderWidth={(current_solution && props.id === current_solution.id) ? 3 : undefined}
                     borderRadius={10}
                     borderColor={colorMode === "light" ? "gray.700" : "gray.200"}
                     alignItems={"flex-start"}
                     padding={1}
                     onClick={() => {
                         setSolution(props)
                     }}
            >
                <HStack>
                    <VStack divider={<Divider borderColor={colorMode === "dark" ? "white" : "black"}/>} spacing={1}>
                        <Text fontSize='sm'>
                            Решение № {props.id}
                        </Text>

                        <Text fontSize='sm'>
                            {props.time_finish ? get_format_date(props.time_finish) : get_format_date(props.time_start)}
                        </Text>
                    </VStack>
                    <Text>
                        Результат: {props.score}/TODO
                    </Text>
                    <Spacer/>
                    <SolutionCheckSystemInfo {...props}/>
                </HStack>
            </LinkBox>
        </SimpleGrid>


    )
        ;
}
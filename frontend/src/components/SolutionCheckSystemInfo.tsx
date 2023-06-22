import {Link} from 'react-router-dom';

import {
    Button,
    Center, Code,
    Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader,
    DrawerOverlay, Heading,
    IconButton,
    LinkBox,
    Stack,
    Text,
    useColorMode,
    useDisclosure, VStack
} from '@chakra-ui/react';
import {BorderShadowBox} from "./BorderShadowBox";
import {ISolution} from "../models/ISolution";
import {ISolutionStatus} from "../models/ITask";
import React, {useEffect} from "react";
import {get_format_date} from "../api/Common";
import {GoInfo} from 'react-icons/go';
import {TaskAttachment} from "./TaskAttachment";

export const SolutionCheckSystemInfo: (solution: ISolution) => JSX.Element = (solution: ISolution) => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const theme = {
        bg: 'gray.500',
        text: 'Не отправлялось',
    };
    if (solution.status === ISolutionStatus.ERROR) {
        theme.bg = 'red.500';
        theme.text = 'Доработать';
    } else if (solution.status === ISolutionStatus.ON_REVIEW) {
        theme.bg = 'yellow.500';
        theme.text = 'На проверке';
    } else if (solution.status === ISolutionStatus.COMPLETE_NOT_MAX) {
        theme.bg = 'green.300'
        theme.text = 'Зачтено'
    } else if (solution.status === ISolutionStatus.COMPLETE) {
        theme.bg = 'green.600'
        theme.text = 'Зачтено'
    }
    return (
        <>
            <IconButton aria-label={"Test system information"}
                        icon={<GoInfo/>}
                        onClick={onOpen}
                        bg={"transparent"}
                        bgColor={theme.bg}
                        border={"1px"}
                        _hover={{"background": "transparent"}}
            />
            <Drawer onClose={onClose}
                    isOpen={isOpen}
                    size={"lg"}
            >
                <DrawerOverlay/>
                <DrawerContent borderRadius="3px">
                    <DrawerCloseButton/>
                    <DrawerHeader fontSize="4xl"
                                  borderBottomWidth="1px"
                    >
                        Решение № {solution.id}
                    </DrawerHeader>
                    <DrawerBody>
                        <VStack spacing={1} alignItems={"flex-start"}>
                            {
                                solution.check_system_answer?.split("\n").map((st, i) => {
                                    return <Text whiteSpace={"pre"} fontSize="lg" children={st} textAlign={"left"}
                                                 key={i}/>
                                })

                            }
                            {solution.input_data &&
                                <>
                                    <Text fontWeight={'bold'}>Входные данные:</Text>
                                    <Divider/>
                                    <Text whiteSpace={'pre-line'}>{solution.input_data}</Text>
                                    <Divider/>
                                </>
                            }
                            {solution.user_answer &&
                                <>
                                    <Text fontWeight={'bold'}>Ваш ответ:</Text>
                                    <Divider/>
                                    <Text whiteSpace={'pre-line'}>{solution.user_answer}</Text>
                                    <Divider/>
                                </>
                            }
                            {solution.except_answer &&
                                <>
                                    <Text fontWeight={'bold'}>Верный ответ:</Text>
                                    <Divider/>
                                    <Text whiteSpace={'pre-line'}>{solution.except_answer}</Text>
                                    <Divider/>
                                </>
                            }
                            {solution.unit_test_code &&
                                <>
                                    <Text fontWeight={'bold'}>Код проверки:</Text>
                                    <Divider/>
                                    <Text whiteSpace={'pre-line'}>{solution.unit_test_code}</Text>
                                    <Divider/>
                                </>
                            }
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}
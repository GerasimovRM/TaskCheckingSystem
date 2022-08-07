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
import {useTypedSelector} from "../hooks/useTypedSelector";
import {useActions} from "../hooks/useActions";
import React, {useEffect} from "react";
import {get_format_date} from "../api/Common";
import {GoInfo} from 'react-icons/go';
import {TaskAttachment} from "./TaskAttachment";

export const SolutionCheckSystemInfo: (solution: ISolution) => JSX.Element = (solution: ISolution) => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    return (
        <>
            <IconButton aria-label={"Test system information"}
                        icon={<GoInfo/>}
                        onClick={onOpen}
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
                        <VStack spacing={1}>
                        {
                            solution.check_system_answer?.split("\n").map(st => {
                                return <Code fontSize="lg" children={st}/>
                            })
                        }
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}
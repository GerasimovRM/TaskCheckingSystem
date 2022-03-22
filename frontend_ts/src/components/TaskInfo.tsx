import React, {PropsWithChildren, useEffect, useState} from 'react';

import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    FormControl,
    FormLabel,
    IconButton,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Stack,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Text,
    useColorMode,
    useDisclosure
} from '@chakra-ui/react';

import {ISolutionStatus} from "../models/ITask";
import {EditIcon} from "@chakra-ui/icons";
import Editor from "@monaco-editor/react";
import {useTypedSelector} from "../hooks/useTypedSelector";
import {IGroupRole} from "../models/IGroupRole";


export interface ITaskInfo {
    status: ISolutionStatus;
    points: number;
    maxPoints: number;
    date: Date;
    code: string;
    groupRole: IGroupRole;
}

interface TextInputProps extends PropsWithChildren<any> {
    id?: string;
    label: string;
    defaultValue: any;
    min: any;
    max: any;

}

// @ts-ignore
const Form = ({ score, maxScore, onCancel, onClose }) => {
    return (
        <Stack spacing={4} color={"gray.400"}>
            <FormControl>
                <FormLabel htmlFor={"score"}>Балл</FormLabel>
                <NumberInput id='score'
                             min={0}
                             max={maxScore}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>
            <ButtonGroup d='flex' justifyContent='flex-end'>
                <Button variant='outline' onClick={onCancel}>
                    Cancel
                </Button>
                <Button colorScheme='teal' onClick={onClose}>
                    Save
                </Button>
            </ButtonGroup>
        </Stack>
    )
}

// @ts-ignore
const PopoverForm = ({points, maxPoints, editable}) => {
    const { onOpen, onClose, isOpen } = useDisclosure()

    return (
        <>
            <Box d='inline-block' mr={3}>
                {`${points}/${maxPoints}`}
            </Box>
            {editable &&
                <Popover
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onClose={onClose}
                    placement='right'
                    closeOnBlur={false}

                >
                    <PopoverTrigger>
                        <IconButton size='sm'
                                    icon={<EditIcon/>}
                                    aria-label="Search database" background={"inherit"}/>
                    </PopoverTrigger>
                    <PopoverContent p={5}>
                        <Form score={points}
                              maxScore={maxPoints}
                              onCancel={() => {
                                  onClose()

                              }}
                              onClose={onClose}
                        />
                    </PopoverContent>
                </Popover>
            }
        </>
    )
}



export const TaskInfo: (props: ITaskInfo) => JSX.Element = (props: ITaskInfo) => {
    const theme = {
        bg: 'green.500, green.500',
        text: 'Зачтено',
    };
    if (props.status === ISolutionStatus.ERROR) {
        theme.bg = 'red.500, red.500';
        theme.text = 'Доработать';
    }
    if (props.status === ISolutionStatus.ON_REVIEW) {
        theme.bg = 'yellow.500, yellow.500';
        theme.text = 'На проверке';
    }
    const {colorMode} = useColorMode()
    const {current_solution} = useTypedSelector(state => state.solution)
    const [currentCode, setCurrentCode] = useState<string>()
    useEffect(() => {
        current_solution && setCurrentCode(current_solution.code)
    }, [current_solution])
    return (
        <Flex direction="column">
            <Box
                bgGradient={`linear(to-r, ${theme.bg})`}
                style={{
                    padding: '0.2em 1em',
                    borderRadius: 'var(--chakra-radii-md) var(--chakra-radii-md) 0 0',
                }}
            >
                <Stat>
                    <StatLabel>
                        <Text fontSize="xl" color="white">
                            {theme.text}
                        </Text>
                    </StatLabel>
                    <StatNumber color="white">
                        <PopoverForm points={props.points}
                                     maxPoints={props.maxPoints}
                                     editable={props.groupRole !== IGroupRole.STUDENT}
                        />
                    </StatNumber>
                    <StatHelpText>
                        <Text fontSize="md" color="white">
                            Отправлено {props.date.toLocaleString()}
                        </Text>
                    </StatHelpText>
                </Stat>
            </Box>
            <Editor
                height="60vh"
                defaultLanguage="python"
                theme={colorMode === "light"? "light": "vs-dark"}
                value={currentCode}
                onChange={value => {
                    setCurrentCode(value!)
                    console.log(value)
                }}
                options={{readOnly: props.groupRole !== IGroupRole.STUDENT}}
            />
        </Flex>
    )
}

import React, {ForwardedRef, PropsWithChildren, MutableRefObject} from 'react';

import {
    Box,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Text,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Popover,
    PopoverTrigger,
    IconButton,
    PopoverContent,
    Stack,
    ButtonGroup,
    Button,
    PopoverArrow,
    PopoverCloseButton,
    useDisclosure,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberDecrementStepper,
    NumberIncrementStepper
} from '@chakra-ui/react';
import {FocusLock} from "@chakra-ui/focus-lock";
import {ISolutionStatus} from "../models/ITask";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {darcula} from "react-syntax-highlighter/dist/cjs/styles/prism";
import {EditIcon} from "@chakra-ui/icons";

export interface ITaskInfo {
    status: ISolutionStatus;
    points: number;
    maxPoints: number;
    date: Date;
    code: string;

}

interface TextInputProps extends PropsWithChildren<any> {
    id?: string;
    label: string;
    defaultValue: any;
    min: any;
    max: any;
}

const TextInput = React.forwardRef((props: TextInputProps) => {
    return (
        <FormControl>
            <FormLabel htmlFor={props.id}>{props.label}</FormLabel>
            <NumberInput id={props.id} {...props}>
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
        </FormControl>
    )
})

// @ts-ignore
const Form = ({ score, maxScore, onCancel }) => {
    return (
        <Stack spacing={4}>
            <FormControl>
                <FormLabel htmlFor={"score"}>Балл</FormLabel>
                <NumberInput id='score'
                             defaultValue={score || maxScore}
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
                <Button isDisabled colorScheme='teal'>
                    Save
                </Button>
            </ButtonGroup>
        </Stack>
    )
}

// @ts-ignore
const PopoverForm = ({points, maxPoints}) => {
    const { onOpen, onClose, isOpen } = useDisclosure()

    return (
        <>
            <Box d='inline-block' mr={3}>
                {`${points}/${maxPoints}`}
            </Box>
            <Popover
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                placement='right'
                closeOnBlur={false}
                colorScheme={"green"}
            >
                <PopoverTrigger>
                    <IconButton size='sm'
                                icon={<EditIcon />}
                                aria-label="Search database"/>
                </PopoverTrigger>
                <PopoverContent p={5}>
                    <FocusLock persistentFocus={false}>
                        <Form score={points} maxScore={maxPoints} onCancel={onClose} />
                    </FocusLock>
                </PopoverContent>
            </Popover>
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
    return (
        <Box flex="1" borderRadius="md" h="75vh" overflow="auto">
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
                            <PopoverForm points={props.points} maxPoints={props.maxPoints}/>
                        </StatNumber>
                        <StatHelpText>
                            <Text fontSize="md" color="white">
                                Отправлено {props.date.toLocaleString()}
                            </Text>
                        </StatHelpText>
                    </Stat>
                </Box>
                <Box flex="1" >
                    <SyntaxHighlighter
                        language="python"
                        style={darcula}
                        showLineNumbers
                        wrapLongLines
                        customStyle={{
                            margin: '0',
                            borderRadius:
                                '0 0 var(--chakra-radii-md) var(--chakra-radii-md)',
                            height: '100%',
                        }}
                    >
                        {props.code}
                    </SyntaxHighlighter>
                </Box>
            </Flex>
        </Box>
    );
}

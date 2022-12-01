import React, {PropsWithChildren, useEffect} from 'react';

import {
    Box,
    Button,
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
import {useActions} from "../hooks/useActions";
import {Field, FieldInputProps, Form, Formik, FormikProps} from "formik";
import SolutionService from "../services/SolutionService";
import {get_format_date, sleep} from "../api/Common";


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
const FormExample = ({ score, maxScore, onCancel, onClose }) => {
    const {current_solution} = useTypedSelector(state => state.solution)
    const {setSolution} = useActions()
    return (
        <Formik enableReinitialize={true}
                initialValues={{score: score}}
                onSubmit={async (values, actions) => {
                    console.log(actions)
                    let sendScore: number = values.score
                    if (values.score > maxScore)
                        sendScore = maxScore
                    else if (values.score < 0)
                        sendScore = 0
                    const updateSolution = await SolutionService.postSolutionChangeScore(current_solution!.id, false, sendScore)
                    setSolution(updateSolution)
                    actions.setSubmitting(false)

                }}
        >
            {(props) => (
                <Form>
                    <Field name='score'>
                        {({ field, form }: { field: FieldInputProps<string>, form: FormikProps<{ score: number}> })  => (
                            <FormControl id={field.name} >
                                <FormLabel htmlFor={field.name}>Оценка</FormLabel>
                                <NumberInput
                                    id={field.name}
                                    {...field}
                                    onChange={(val) => {
                                        form.setFieldValue(field.name, val)
                                    }}
                                    max={maxScore}
                                    min={0}
                                >
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </FormControl>
                        )}
                    </Field>
                    <Button
                        mt={4}
                        colorScheme='green'
                        isLoading={props.isSubmitting}
                        onClick={onClose}
                        type='submit'
                    >
                        Отправить
                    </Button>
                    <Button
                        mt={4}
                        colorScheme='red'
                        isLoading={props.isSubmitting}
                        onClick={async () => {
                            const updateSolution = await SolutionService.postSolutionChangeScore(current_solution!.id, true)
                            setSolution(updateSolution)
                            onClose()
                        }}
                        type='reset'
                    >
                        На доработку
                    </Button>
                </Form>
            )}
        </Formik>
    )
}

// @ts-ignore
const PopoverForm = ({points, maxPoints, editable}) => {
    const { onOpen, onClose, isOpen } = useDisclosure()

    return (
        <>
            <Box display='inline-block' mr={3}>
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
                        <FormExample score={points}
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
        bg: 'gray.500, gray.500',
        text: 'Не отправлялось',
    };
    if (props.status === ISolutionStatus.ERROR) {
        theme.bg = 'red.500, red.500';
        theme.text = 'Доработать';
    }
    else if (props.status === ISolutionStatus.ON_REVIEW) {
        theme.bg = 'yellow.500, yellow.500';
        theme.text = 'На проверке';
    }
    else if (props.status === ISolutionStatus.COMPLETE_NOT_MAX) {
        theme.bg = 'green.300, green.300'
        theme.text = 'Зачтено'
    }
    else if (props.status === ISolutionStatus.COMPLETE) {
        theme.bg = 'green.600, green.600'
        theme.text = 'Зачтено'
    }
    const {colorMode} = useColorMode()
    const {current_solution, isChanged} = useTypedSelector(state => state.solution)
    const {setCodeSolution, setIsChangedSolution} = useActions()
    const format_date = get_format_date(props.date)

    useEffect(() => {
        console.log()
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
                        <Text fontSize="xl">
                            {theme.text}
                        </Text>
                    </StatLabel>
                    <StatNumber>
                        <PopoverForm points={props.points}
                                     maxPoints={props.maxPoints}
                                     editable={props.groupRole !== IGroupRole.STUDENT}
                        />
                    </StatNumber>
                    <StatHelpText>
                        <Text fontSize="md">
                            Отправлено {format_date.toLocaleString()}
                        </Text>
                    </StatHelpText>
                </Stat>
            </Box>
            <Flex border="1px"
                  borderTop="hidden"
                  borderColor={colorMode === "light" ? "gray.200": "gray.700"}>
            <Editor
                height="60vh"
                defaultLanguage="python"
                theme={colorMode === "light"? "light": "vs-dark"}
                value={current_solution?.code}
                onChange={value => {
                    if (value) {
                        setCodeSolution(value)
                        if (!isChanged)
                            setIsChangedSolution(true)
                    }
                }}
                options={{readOnly: props.groupRole !== IGroupRole.STUDENT}}
            />
            </Flex>
        </Flex>
    )
}

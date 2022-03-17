import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Heading, Icon,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
} from '@chakra-ui/react';

import {darcula} from 'react-syntax-highlighter/dist/cjs/styles/prism';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {TaskAttachment} from "../components/TaskAttachment";
import {ISolution, ITaskStatus, ITaskWithSolution} from "../models/ITask";
import {TaskInfo} from "../components/TaskInfo";
import PageDataService from "../api/PageDataService";
import {BaseSpinner} from "../components/BaseSpinner";
import Chat from "../components/Chat";
import fileDialog from "file-dialog";
import {useLocation} from "react-router-dom";
import { BiSend } from 'react-icons/all';

export default function TaskPage() {
    const {groupId, courseId, lessonId, taskId} = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [taskWithSolution, setTaskWithSolution] = useState<ITaskWithSolution>()
    const [solutions, setSolutions] = useState<ISolution[]>()
    const [currentSolutionId, setCurrentSolutionId] = useState<number>()
    const location = useLocation();

    const sendFileFromDialog = () => {
        fileDialog().then(async (files) => {
            /*TODO: image_load
            const formData = new FormData()
            formData.append("file", files[0], files[0].name)
            const requestConfig: IRequestConfig = {
                method: "post",
                url: "/page_data/upload_image",
                auth: true,
                headers: {'Content-Type': 'multipart/form-data'},
                data: formData
            }
            const resp = await request(requestConfig)
            console.log(resp)
             */
            const res = await PageDataService.postTaskSolution(groupId!, courseId!, lessonId!, taskId!, files)
            console.log(res)
            setIsLoading(true)
        })
    }

    useEffect(() => {
        async function fetchTask() {
            const taskResponse = await PageDataService.getGroupCourseLessonTask(groupId!, courseId!, lessonId!, taskId!)
            setTaskWithSolution(taskResponse)
            const solutionsResponse = await PageDataService.getTaskSolutions(groupId!, courseId!, taskId!)
            setSolutions(solutionsResponse)
            const solution_id=new URLSearchParams(location.search).get("solution_id")
            const current_solution = solution_id && solutionsResponse.find((solution) => String(solution.id) === solution_id)
            if (current_solution)
                setCurrentSolutionId(current_solution && Number(current_solution.id))
            else if (solutionsResponse[0])
                setCurrentSolutionId(Number(solutionsResponse[0].id))
        }

        fetchTask().then(() => {
            setIsLoading(false)
        })
    }, [groupId, courseId, lessonId, taskId, isLoading, location])
    if (isLoading)
        return <BaseSpinner/>;
    return (
        <Grid templateColumns='repeat(4, 1fr)' gap={6}>
            <GridItem colSpan={3}>
                <Heading>{taskWithSolution?.name}</Heading>
                <Tabs isFitted variant='enclosed'>
                    <TabList>
                        <Tab>Условие задачи</Tab>
                        {solutions && solutions[0] &&
                            <Tab isDisabled={solutions.length === 0}>
                                {solutions.length !== 0 && "Решение"}
                            </Tab>
                        }
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Text fontSize="lg">{taskWithSolution?.description}</Text>
                            <br/>
                            {taskWithSolution?.attachments && taskWithSolution?.attachments.length > 0 && (
                                <Heading>Вложения</Heading>
                            )}
                            {taskWithSolution?.attachments?.map((v, index) => (
                                <TaskAttachment key={index} {...v} />
                            ))}
                        </TabPanel>
                        {solutions && solutions[0] &&
                        <TabPanel>
                            <Flex>
                                <Box flex="1" borderRadius="md" h="75vh">
                                    <Flex direction="column">
                                        <TaskInfo
                                            status={solutions.find(sol => Number(sol.id) === currentSolutionId)!.status}
                                            points={solutions.find(sol => Number(sol.id) === currentSolutionId)!.score}
                                            maxPoints={taskWithSolution?.max_score!}
                                            date={solutions.find(sol => Number(sol.id) === currentSolutionId)!.time_start}
                                        />
                                        <Box flex="1">
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
                                                {solutions && solutions[0] && solutions[0].code}
                                            </SyntaxHighlighter>
                                        </Box>
                                    </Flex>
                                </Box>
                            </Flex>
                        </TabPanel>
                        }
                    </TabPanels>
                </Tabs>
            </GridItem>
            <GridItem>
                <Button onClick={sendFileFromDialog}
                        mb={2}
                        width={"100%"}
                >
                    <Icon
                        as={BiSend}
                        textAlign="center"
                        w="6"
                        h="6"
                    />
                    Отправить решение
                </Button>
                <Box bg="gray.50" borderRadius="md">
                    <Flex direction="column" h="100%">
                        <Box
                            w="100%"
                            borderRadius="md"
                            style={{
                                padding: '1vh 0',
                                borderRadius:
                                    'var(--chakra-radii-md) var(--chakra-radii-md) 0 0',
                            }}
                        >
                            <Heading size="lg" color="gray.600" textAlign="center">
                                Чат
                            </Heading>
                        </Box>
                        <Chat
                            messages={solutions && solutions[0] && solutions?.map((solution) => `${solution.id}`)}
                            event={setCurrentSolutionId}
                        />
                    </Flex>
                </Box>
            </GridItem>
        </Grid>
    );
}

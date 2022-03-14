import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Heading,
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
import {ITaskStatus, ITaskWithSolution} from "../models/ITask";
import {TaskInfo} from "../components/TaskInfo";
import PageDataService from "../api/PageDataService";
import {BaseSpinner} from "../components/BaseSpinner";
import Chat from "../components/Chat";
import fileDialog from "file-dialog";

export default function TaskPage() {
    const {groupId, courseId, lessonId, taskId} = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [taskWithSolution, setTaskWithSolution] = useState<ITaskWithSolution>()

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
        }

        fetchTask().then(() => {
            setIsLoading(false)
        })
    }, [groupId, courseId, lessonId, taskId, isLoading])
    if (isLoading)
        return <BaseSpinner/>;
    return (
        <Grid templateColumns='repeat(5, 1fr)' gap={6}>
            <GridItem colSpan={4}>
                <Heading>{taskWithSolution?.name}</Heading>
                <Tabs isFitted variant='enclosed'>
                    <TabList>
                        <Tab>Условие задачи</Tab>
                        {taskWithSolution?.solution &&
                        <Tab isDisabled={taskWithSolution!.solution === undefined}>Решение</Tab>
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
                        {taskWithSolution?.solution &&
                        <TabPanel>
                            <Flex>
                                <Box flex="1" borderRadius="md" h="75vh">
                                    <Flex direction="column">
                                        <TaskInfo
                                            status={taskWithSolution?.solution.status}
                                            points={taskWithSolution?.solution.score}
                                            maxPoints={taskWithSolution?.max_score}
                                            date={taskWithSolution?.solution.time_start}
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
                                                {taskWithSolution?.solution.code}
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
                <Button alignSelf="center" mb={5}
                        onClick={() => sendFileFromDialog()}
                >
                    Отправить решение
                </Button>
                <Box h="60vh" bg="gray.50" borderRadius="md">
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
                        <Box flex="1" h="100%">
                            <Chat/>
                        </Box>
                    </Flex>
                </Box>
            </GridItem>
        </Grid>
    );
}

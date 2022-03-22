import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Heading,
    Icon,
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
import {TaskInfo} from "../components/TaskInfo";
import {BaseSpinner} from "../components/BaseSpinner";
import Chat from "../components/Chat";
import fileDialog from "file-dialog";
import {useLocation} from "react-router-dom";
import {BiSend} from 'react-icons/all';
import {ISolution} from "../models/ISolution";
import TaskService from "../services/TaskService";
import {ITask} from "../models/ITask";
import SolutionService from "../services/SolutionService";
import {TaskStudentsList} from "../components/TaskStudentsList";
import {IGroupRole} from "../models/IGroupRole";
import GroupService from "../services/GroupService";

export default function TaskPage() {
    const {groupId, courseId, lessonId, taskId} = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [task, setTask] = useState<ITask>()
    const [solution, setSolution] = useState<ISolution | null>()
    const location = useLocation();
    const [groupRole, setGroupRole] = useState<IGroupRole>()

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
            const res = await SolutionService.postSolution(groupId!, courseId!, lessonId!, taskId!, files)
            console.log(res)
            setIsLoading(true)
        })
    }

    useEffect(() => {
        async function fetchTask() {
            const task = await TaskService.getTask(groupId!, courseId!, lessonId!, taskId!)
            setTask(task)
            const groupRole = await GroupService.getGroupRole(groupId!)
            setGroupRole(groupRole)
            if (groupRole === IGroupRole.STUDENT) {
                const solution = await SolutionService.getBestSolution(groupId!, courseId!, taskId!)
                if (solution)
                    setSolution(solution)
            }

            // const solution_id=new URLSearchParams(location.search).get("solution_id")
        }
        if (isLoading)
            fetchTask().then(() => {
                setIsLoading(false)
        })
    }, [groupId, courseId, lessonId, taskId, isLoading, location])
    if (isLoading)
        return <BaseSpinner/>;
    return (
        <Grid templateColumns='repeat(5, 2fr)' gap={6}>
            <GridItem colSpan={5}>
                <Heading mb={2}>{task?.name}</Heading>
            </GridItem>
            <GridItem colSpan={3}>
                <Tabs isFitted variant='enclosed'>
                    <TabList>
                        <Tab>Условие задачи</Tab>
                        {solution &&
                            <Tab>
                                Решение
                            </Tab>
                        }
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Text fontSize="lg">{task?.description}</Text>
                            <br/>
                            {task?.attachments && task?.attachments.length > 0 && (
                                <Heading>Вложения</Heading>
                            )}
                            {task?.attachments?.map((v, index) => (
                                <TaskAttachment key={index} {...v} />
                            ))}
                        </TabPanel>
                        {solution &&
                        <TabPanel>
                            <Flex>
                                <TaskInfo
                                    status={solution.status}
                                    points={solution.score}
                                    maxPoints={task!.max_score}
                                    date={solution.time_start}
                                    code={solution.code}
                                />
                            </Flex>
                        </TabPanel>
                        }
                    </TabPanels>
                </Tabs>
            </GridItem>
            <GridItem>
                {groupRole === IGroupRole.STUDENT &&
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
                }
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
                        <Chat/>
                    </Flex>
                </Box>
            </GridItem>
            {groupRole !== IGroupRole.STUDENT &&
                <GridItem>
                    <TaskStudentsList event={setSolution}/>
                </GridItem>
            }
        </Grid>
    );
}

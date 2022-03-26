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
import {useTypedSelector} from "../hooks/useTypedSelector";
import {useActions} from "../hooks/useActions";
import {BorderShadowBox} from "../components/BorderShadowBox";

export default function TaskPage() {
    const {groupId, courseId, lessonId, taskId} = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [task, setTask] = useState<ITask>()
    const location = useLocation();
    const [groupRole, setGroupRole] = useState<IGroupRole>()
    const {current_solution} = useTypedSelector(state => state.solution)
    const {fetchBestSolution, clearSolution, clearSelectedUser} = useActions()
    const {selectedUser} = useTypedSelector(state => state.selectedUser)
    const {user} = useTypedSelector(state => state.auth)
    const {setSelectedUser} = useActions()

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
            // TODO: что делать после отправки задачи?
            clearSolution()
        })
    }

    useEffect(() => {
        async function fetchTask() {
            const task = await TaskService.getTask(groupId!, courseId!, lessonId!, taskId!)
            setTask(task)

        }
        fetchTask().then(() => {
            setIsLoading(false)
        })
        return () => {
            clearSolution()
            clearSelectedUser()
        }
    }, [groupId, courseId, lessonId, taskId, location, isLoading])
    if (isLoading)
        return <BaseSpinner/>;
    // TODO: костыль с количеством строк
    return (
        <Grid templateColumns='repeat(5, 2fr)' gap={5}>
            <GridItem colSpan={5}>
                <Heading mb={2}>{task?.name}</Heading>
            </GridItem>
            <GridItem colSpan={groupRole === IGroupRole.STUDENT? 4: 3}>
                <Tabs isFitted variant='enclosed'>
                    <TabList>
                        <Tab>Условие задачи</Tab>
                        {current_solution &&
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
                        {current_solution &&
                        <TabPanel>
                            <TaskInfo
                                status={current_solution.status}
                                points={current_solution.score}
                                maxPoints={task!.max_score}
                                date={current_solution.time_start}
                                code={current_solution.code}
                                groupRole={groupRole!}
                            />
                        </TabPanel>
                        }
                    </TabPanels>
                </Tabs>
            </GridItem>
            <GridItem colSpan={1}>
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
                <BorderShadowBox>
                    <Flex direction="column" h="100%">
                        <Heading size="lg" textAlign="center">
                            Чат
                        </Heading>
                        <Chat/>
                    </Flex>
                </BorderShadowBox>
            </GridItem>
            {groupRole !== IGroupRole.STUDENT &&
                <GridItem colSpan={1}>
                    <TaskStudentsList />
                </GridItem>
            }
        </Grid>
    );
}

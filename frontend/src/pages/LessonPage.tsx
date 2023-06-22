import React, {FunctionComponent, useEffect, useState} from 'react';
import {useParams} from 'react-router';

import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Heading,
    VStack,
} from '@chakra-ui/react';


import {BaseSpinner} from "../components/BaseSpinner";
import TaskService from "../services/TaskService";
import {ITasksResponse} from "../models/ITasksResponse";
import LessonService from "../services/LessonService";
import {ILesson} from "../models/ILesson";
import GroupService from "../services/GroupService";
import {IGroupRole} from "../models/IGroupRole";
import {Layout} from "../components/layouts/Layout";
import {ITaskType} from "../models/ITask";
import {TaskPreviewStudent} from "../components/TaskPreviewStudent";
import {TaskPreviewTeacher} from "../components/TaskPreviewTeacher";


const LessonPage: FunctionComponent = () => {
    const {courseId, groupId, lessonId} = useParams();
    const [tasksResponse, setTasksResponse] = useState<ITasksResponse>()
    const [lesson, setLesson] = useState<ILesson>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [groupRole, setGroupRole] = useState<IGroupRole>()

    useEffect(() => {
        async function fetchTasks() {
            const lessonResponse = await LessonService.getLesson(groupId!, courseId!, lessonId!)
            const tasksResponse = await TaskService.getTasks(groupId!, courseId!, lessonId!)
            const groupRole = await GroupService.getGroupRole(groupId!)
            setTasksResponse(tasksResponse)
            setLesson(lessonResponse)
            setGroupRole(groupRole)
        }

        fetchTasks()
            .then(() => {
                setIsLoading(false)
            })
    }, [courseId, groupId, lessonId])

    if (isLoading) {
        return <BaseSpinner/>
    } else {
        return (
            <Layout
                headerChildren={
                    <VStack alignItems={"flex"}>
                        <Accordion allowMultiple>
                            <AccordionItem borderBottom="none" borderTop="none">
                                <AccordionButton borderWidth="1px" borderRadius="lg" padding="1vw">
                                    <Box flex="1" textAlign="left">
                                        <Heading>{lesson!.name}</Heading>
                                    </Box>
                                    <AccordionIcon/>
                                </AccordionButton>
                                <AccordionPanel pb={4}>
                                    {lesson!.description}
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                        <Heading padding="1vw">Задачи</Heading>
                    </VStack>
                }
                mainChildren={
                    <>
                        {[
                            ["Классная работа", ITaskType.CLASS_WORK],
                            ["Домашняя работа", ITaskType.HOME_WORK],
                            ["Дополнительные задачи", ITaskType.ADDITIONAL_WORK]].map((elem) => {
                            return <>
                                {tasksResponse!.tasks.filter((task) => {
                                        return task.task_type === elem[1]
                                    }).length ?
                                    <>
                                        <Heading size={"md"} paddingBottom={4}>
                                            {elem[0]}
                                        </Heading>
                                        {
                                            tasksResponse!.tasks.filter((task) => {
                                                return task.task_type === elem[1]
                                            }).map((task, i) => {
                                                if (groupRole! === IGroupRole.STUDENT)
                                                    return (<TaskPreviewStudent key={task.id}
                                                                                taskId={task.id}
                                                                                taskName={task.name}
                                                                                taskMaxScore={task.max_score}
                                                    />)
                                                else
                                                    return (<TaskPreviewTeacher key={task.id}
                                                                                taskId={task.id}
                                                                                taskName={task.name}
                                                    />)
                                            })
                                        }
                                    </>
                                    :
                                    <></>
                                }
                            </>
                        })
                        }
                    </>
                }
            />
        )
    }
}

export default LessonPage
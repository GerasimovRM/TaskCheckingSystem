import {Link} from 'react-router-dom';

import {HStack, IconButton, Progress, Spacer, Text, VStack} from '@chakra-ui/react';
import {ILessonPreview} from "../models/ILessonPreview";
import {BorderShadowBox} from "./BorderShadowBox";
import React, {useEffect, useState} from "react";
import {LessonPreviewTaskInfoForStudent} from "./LessonPreviewTaskInfoForStudent";
import {MdKeyboardArrowDown, MdKeyboardArrowUp} from 'react-icons/all';
import {IStatusTaskColor} from "../models/IStatusTaskColor";
import {ITaskCountForStudentResponse} from "../models/ITaskCountForStudentResponse";
import TaskService from "../services/TaskService";
import {IGroupRole} from "../models/IGroupRole";

export const LessonPreviewForStudent: (props: ILessonPreview) => JSX.Element = (props: ILessonPreview) => {
    const [statusTaskColor, setStatusTaskColor] = useState<IStatusTaskColor>()
    const [openTasksInfo, setOpenTasksInfo] = useState<boolean>(false)
    const [taskCountForStudent, setTaskCountForStudent] = useState<ITaskCountForStudentResponse>()
    const [userRole, setUserRole] = useState<IGroupRole>()

    useEffect(() => {
        TaskService.getCountForStudent(props.groupId, props.courseId, props.lessonId).then((taskCount) => {
            setTaskCountForStudent(taskCount)
        })

    }, [])
    return (
        <VStack alignSelf={"left"} mb={4}>
            <BorderShadowBox padding="0.5vw" width={"100%"}>
                <HStack>
                    <HStack as={Link} to={`lesson/${props.lessonId}`} style={{width: "100%"}}>
                        <Text
                            ml="2"
                            fontSize="2xl"
                            style={{
                                textTransform: 'capitalize',
                            }}
                        >
                            {props.name}
                        </Text>
                        <Spacer/>
                        <Text>
                            Решено: {taskCountForStudent?.tasks_complete_count}/{taskCountForStudent?.tasks_count}
                        </Text>
                    </HStack>
                    <IconButton aria-label={"Дополнительно"}
                                size={"lg"}
                                bg={"transparent"}
                                style={{backgroundColor: "transparent"}}
                                _hover={{"background": "transparent"}}
                                icon={!openTasksInfo ? <MdKeyboardArrowDown/> : <MdKeyboardArrowUp/>}
                                onClick={() => {
                                    setOpenTasksInfo(!openTasksInfo)
                                }}
                    />
                </HStack>
                <Progress colorScheme={taskCountForStudent ? "green" : "gray"}
                          w={"100%"}
                          size='lg'
                          borderRadius="lg"
                          max={taskCountForStudent?.tasks_count}
                          value={taskCountForStudent?.tasks_complete_count}
                          isAnimated={true}
                />
                {openTasksInfo &&
                    <LessonPreviewTaskInfoForStudent {...props}/>
                }
            </BorderShadowBox>
        </VStack>
    );
}
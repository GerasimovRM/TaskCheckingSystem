import React, {FunctionComponent, useEffect, useState} from 'react';
import {
    HStack,
    Icon,
    Image,
    Text,
    TableContainer, Thead, Tr, Th, Table, Td, Tbody, Divider, Tooltip
} from "@chakra-ui/react";

import {ICourseStat} from "../models/stat/ICourseStat";
import StatService from "../services/StatService";
import {useParams} from "react-router";
import {getTaskStatusColorScheme} from "../common/colors";
import {BorderShadowBox} from "./BorderShadowBox";
import {ITableDataForTeacher} from "../models/stat/ITableDataForTeacher";
import {BaseSpinner} from "./BaseSpinner";

import './ProfileCourse.css'

const ProfileCourseStatForTeacher: FunctionComponent = () => {
    const {groupId, courseId} = useParams();
    const [tableData, setTableData] = useState<ITableDataForTeacher>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [maxScore, setMaxScore] = useState<number>()
    useEffect(() => {
        StatService.getTableForTeacher(groupId!, courseId!).then((tableData) => {
            setTableData(tableData)
        })
    }, [])
    useEffect(() => {
        setIsLoading(false)
        {/*
        if (tableData?.lessons.length !== 0)
            setMaxScore(tableData?.lessons.map((lesson) =>
                lesson.tasks.map((task) =>
                    task.max_score).reduce((a, b) => a + b)).reduce((a, b) => a + b))
         */}
    }, [tableData])

    if (isLoading) {
        return <BaseSpinner />
    }
    return (
        <TableContainer className={'profile-course'}>
            <Table>
                <Thead>
                    <Tr>
                        <Th
                            borderRight={1}
                            borderRightStyle={"inherit"}
                            borderRightColor={"inherit"}
                            borderTop={1}
                            borderTopStyle={"inherit"}
                            borderTopColor={"inherit"}
                            borderLeft={1}
                            borderLeftStyle={"inherit"}
                            borderLeftColor={"inherit"}
                            width={1}
                            rowSpan={2}
                        >
                            №
                        </Th>
                        <Th
                            rowSpan={2}
                            borderRight={1}
                            borderRightStyle={"inherit"}
                            borderRightColor={"inherit"}
                            borderTop={1}
                            borderTopStyle={"inherit"}
                            borderTopColor={"inherit"}
                        >
                            Ученик
                        </Th>
                        {tableData?.lessons.map((lesson, index) => {
                            return (
                                <Th
                                    borderRight={1}
                                    borderRightStyle={"inherit"}
                                    borderRightColor={"inherit"}
                                    borderTop={1}
                                    borderTopStyle={"inherit"}
                                    borderTopColor={"inherit"}
                                    rowSpan={1}
                                    key={index}
                                    colSpan={lesson.tasks.length}>
                                    {lesson.lesson_name}
                                </Th>
                            );
                        })}
                    </Tr>
                    <Tr>
                        {tableData?.lessons.map((lesson) => {
                            return (
                                <>
                                    {lesson.tasks.map((task) => {
                                        return (
                                            <Td
                                            borderRight={1}
                                            borderRightStyle={"inherit"}
                                            borderRightColor={"inherit"}
                                            style={{writingMode: "vertical-rl"}}
                                            >
                                                <Tooltip label={task.task_name}>
                                                    <Text maxH={"120px"} overflow={"hidden"}>
                                                        {task.task_name}
                                                    </Text>
                                                </Tooltip>
                                            </Td>
                                        );
                                    })}
                                </>
                            );

                        })
                        }
                    </Tr>
                </Thead>
                <Tbody>
                    {tableData?.students.map((student, index) => {
                        return (
                            <Tr>
                                <Td borderRight={1}
                                    borderRightStyle={"inherit"}
                                    borderRightColor={"inherit"}
                                    borderLeft={1}
                                    borderLeftStyle={"inherit"}
                                    borderLeftColor={"inherit"}
                                >
                                    {index + 1}
                                </Td>
                                <Td
                                    borderRight={1}
                                    borderRightStyle={"inherit"}
                                    borderRightColor={"inherit"}
                                >
                                    <HStack>
                                        <Image borderRadius="full" boxSize="32px" src={student.student.avatar_url}/>
                                        <Text>
                                            {student.student.last_name}
                                        </Text>
                                        <Text>
                                            {student.student.first_name}
                                        </Text>
                                    </HStack>
                                </Td>
                                {student.tasks.map((task) => {
                                    return (
                                        <Td
                                            borderRight={1}
                                            borderRightStyle={"inherit"}
                                            borderRightColor={"inherit"}
                                        >
                                            <Tooltip label={task.task_name}>
                                                <div>
                                                    <Icon
                                                        as={getTaskStatusColorScheme(task.status).icon}
                                                        color={getTaskStatusColorScheme(task.status).iconColor}
                                                        display={"flex"}
                                                        w="5"
                                                        h="5"
                                                    />
                                                </div>
                                            </Tooltip>
                                        </Td>
                                    );
                                })}

                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </TableContainer>
    );

}

export default ProfileCourseStatForTeacher;
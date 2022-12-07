import React, {FunctionComponent, useEffect, useState} from 'react';
import {
    HStack,
    Icon,
    Image,
    Text,
    TableContainer, Thead, Tr, Th, Table, Td, Tbody, Divider
} from "@chakra-ui/react";

import {ICourseStat} from "../models/stat/ICourseStat";
import StatService from "../services/StatService";
import {useParams} from "react-router";
import {getTaskStatusColorScheme} from "../common/colors";
import {BorderShadowBox} from "./BorderShadowBox";
import {ITableDataForTeacher} from "../models/stat/ITableDataForTeacher";
import {BaseSpinner} from "./BaseSpinner";

const ProfileCourseStatForTeacher: FunctionComponent = () => {
    const {groupId, courseId} = useParams();
    const [tableData, setTableData] = useState<ITableDataForTeacher>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    useEffect(() => {
        StatService.getTableForTeacher(groupId!, courseId!).then((tableData) => {
            setTableData(tableData)
            console.log(tableData)
        }).then(() => {
            setIsLoading(false)
        })
    }, [])
    if (isLoading) {
        <BaseSpinner/>
    }
    return (
        <TableContainer>
            <Table>
                <Thead>
                    <Tr>
                        <Th
                            borderRight={"1px"}
                            borderRightColor={"gray.700"}
                            width={1}
                        >
                            №
                        </Th>
                        <Th borderRight={"1px"}>Ученик</Th>
                        {tableData?.lessons.map((lesson, index) => {
                            return <Th borderRight={"1px"} key={index} colSpan={lesson.tasks.length}>
                                {lesson.lesson_name}
                            </Th>
                        })}
                    </Tr>
                </Thead>
                <Tbody>
                    {tableData?.students.map((student, index) => {
                        return (
                            <Tr>
                                <Td>{index + 1}</Td>
                                <Td>
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
                                        <Td>
                                            <Icon
                                                as={getTaskStatusColorScheme(task.status).icon}
                                                color={getTaskStatusColorScheme(task.status).iconColor}
                                                display={"flex"}
                                                w="4"
                                                h="4"/>
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
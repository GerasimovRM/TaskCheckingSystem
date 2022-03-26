import React, {Dispatch, useEffect, useState} from "react";
import {useParams} from "react-router";
import {ISolutionCountResponse} from "../models/ISolutionCountResponse";
import UserService from "../services/UserService";
import {Button, Heading, Text, VStack} from "@chakra-ui/react";
import {BaseSpinner} from "./BaseSpinner";
import {IStudentWithSolution} from "../models/IStudentWithSolution";
import SolutionService from "../services/SolutionService";
import {TaskStudentsListItem} from "./TaskStudentsListItem";
import {BorderShadowBox} from "./BorderShadowBox";
import {useActions} from "../hooks/useActions";


export const TaskStudentsList: () => JSX.Element = () => {
    const [students, setStudents] = useState<IStudentWithSolution[]>()
    const {courseId, groupId, lessonId, taskId} = useParams()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const {setSelectedUser} = useActions()
    useEffect(() => {
        async function fetchStudentsSolutions() {
            const students = await UserService.getStudentsWithSolution(groupId!, courseId!, taskId!)
            setStudents(students)
            if (students && students.length > 0)
                UserService.getUserById(students[0].user_id).then((user) => setSelectedUser(user))
        }
        fetchStudentsSolutions().then(() => {
            setIsLoading(false)})
    }, [courseId, groupId, lessonId, taskId])
    return (
        <BorderShadowBox>
            <Heading size="lg" textAlign="center" paddingBottom={2}>
                Список студентов
            </Heading>
            <VStack padding={2} alignItems={"start"}>
                {students?.map((student, index) =>
                    <TaskStudentsListItem key={index} studentId={student.user_id}/>
                )}
            </VStack>
        </BorderShadowBox>
    );
}

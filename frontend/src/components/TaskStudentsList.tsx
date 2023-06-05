import React, {Dispatch, useContext, useEffect, useState} from "react";
import {useParams} from "react-router";
import {ISolutionCountResponse} from "../models/ISolutionCountResponse";
import UserService from "../services/UserService";
import {Button, Heading, Text, VStack} from "@chakra-ui/react";
import {BaseSpinner} from "./BaseSpinner";
import {IStudentWithSolution} from "../models/IStudentWithSolution";
import SolutionService from "../services/SolutionService";
import {TaskStudentsListItem} from "./TaskStudentsListItem";
import {BorderShadowBox} from "./BorderShadowBox";
import {IUser} from "../models/IUser";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../context";


export const TaskStudentsList: () => JSX.Element = observer(() => {
    const RS = useContext(RootStoreContext);
    const [students, setStudents] = useState<IUser[]>()
    const {courseId, groupId, lessonId, taskId} = useParams()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const {current_solution} = RS.solutionStore;
    useEffect(() => {
        UserService.getStudentsGroup(groupId!)
            .then(studs => {
                if (studs) {
                    setStudents(studs)
                }
                setIsLoading(false)
            })
    }, [courseId, groupId, lessonId, taskId])

    if (isLoading)
        return <BaseSpinner/>
    return (
        <BorderShadowBox w={"100%"}>
            <Heading size="sm" textAlign="center" paddingBottom={2}>
                Список студентов
            </Heading>
            <VStack padding={2} alignItems={"start"}>
                {students?.map((student, index) =>
                    <TaskStudentsListItem key={index} studentId={student.id} index={index}/>
                )}
            </VStack>
        </BorderShadowBox>
    );
})
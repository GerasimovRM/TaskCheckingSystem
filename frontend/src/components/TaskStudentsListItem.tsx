import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import UserService from "../services/UserService";
import {Box, Text, HStack, Image, Button, SkeletonCircle, SkeletonText, useColorMode} from "@chakra-ui/react";
import {BaseSpinner} from "./BaseSpinner";
import {IUser} from "../models/IUser";
import {useActions} from "../hooks/useActions";
import {useTypedSelector} from "../hooks/useTypedSelector";
import SolutionService from "../services/SolutionService";
import {getTaskStatusColorScheme, IStatusTaskColor} from "./TaskPreviewStudent";

interface ITaskStudentsList {
    studentId: number;
    index: number;
}

export const TaskStudentsListItem: (props: ITaskStudentsList) => JSX.Element = (props: ITaskStudentsList) => {
    const [user, setUser] = useState<IUser>()
    const [statusTaskColor, setStatusTaskColor] = useState<IStatusTaskColor>()
    const {courseId, groupId, lessonId, taskId} = useParams()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const {setSelectedUser, fetchBestSolution, fetchUserData} = useActions()
    const {selectedUser} = useTypedSelector(state => state.selectedUser)
    const {colorMode} = useColorMode()
    const {current_solution} = useTypedSelector(state => state.solution)
    const {users} = useTypedSelector(state => state.usersData)

    function getUserBestSolution() {
        SolutionService.getBestSolution(groupId!, courseId!, taskId!, props.studentId)
            .then((solution) => {
                setStatusTaskColor(getTaskStatusColorScheme(solution?.status))
            })
    }

    function onClick() {
        setSelectedUser(user!)
        fetchBestSolution(groupId!, courseId!, taskId!, props.studentId)
    }

    useEffect(() => {
        if (!user) {
            const checkUser = users.find(u => u.id === props.studentId)
            if (!checkUser) {
                fetchUserData(props.studentId)
            }
        }
    }, [courseId, groupId, lessonId, taskId])

    useEffect(() => {
        if (!user) {
            const checkUser = users.find(u => u.id === props.studentId)
            if (checkUser) {
                setUser(checkUser)
                getUserBestSolution()
                setIsLoading(false)
            }
        }
    }, [fetchUserData, selectedUser])

    useEffect(() => {
        if (user?.id === selectedUser?.id) {
            setStatusTaskColor(getTaskStatusColorScheme(current_solution?.status))
        }
    }, [current_solution])

    return (
        <Button width="100%" justifyContent="start"
                onClick={onClick}
                background={statusTaskColor?.iconColor}
                borderColor={colorMode === "light" ? "gray.700" : "gray.200"}
                borderWidth={(selectedUser && user?.id === selectedUser.id) ? 3: undefined}
        >
            <HStack>
                <SkeletonCircle boxSize="34px" isLoaded={!isLoading}>
                    <Image
                        borderRadius="full"
                        boxSize="34px"
                        src={user?.avatar_url}
                    />
                </SkeletonCircle>
                <SkeletonText isLoaded={!isLoading}>
                    <Text wordBreak={"break-word"}>
                        {`${user?.first_name} ${user?.last_name}`}
                    </Text>
                </SkeletonText>
            </HStack>
        </Button>
    );
}

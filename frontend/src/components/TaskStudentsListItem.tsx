import React, {useContext, useEffect, useState} from "react";
import {useParams} from "react-router";
import UserService from "../services/UserService";
import {Box, Text, HStack, Image, Button, SkeletonCircle, SkeletonText, useColorMode} from "@chakra-ui/react";
import {BaseSpinner} from "./BaseSpinner";
import {IUser} from "../models/IUser";
import SolutionService from "../services/SolutionService";
import { getTaskStatusColorScheme } from "../common/colors";
import {IStatusTaskColor} from "../models/IStatusTaskColor";

import './TaskStudentsListItem.css';
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../context";

interface ITaskStudentsList {
    studentId: number;
    index: number;
}

export const TaskStudentsListItem: (props: ITaskStudentsList) => JSX.Element = observer((props: ITaskStudentsList) => {
    const RS = useContext(RootStoreContext);
    const [user, setUser] = useState<IUser>()
    const [statusTaskColor, setStatusTaskColor] = useState<IStatusTaskColor>()
    const {courseId, groupId, lessonId, taskId} = useParams()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const {selectedUser} = RS.selectedUserStore;
    const {colorMode} = useColorMode()
    const {current_solution} = RS.solutionStore;
    const {users} = RS.usersDataStore;

    function getUserBestSolution() {
        SolutionService.getBestSolution(groupId!, courseId!, taskId!, props.studentId)
            .then((solution) => {
                setStatusTaskColor(getTaskStatusColorScheme(solution?.status))
            })
    }

    function onClick() {
        RS.selectedUserStore.setSelectedUser(user!);
        RS.solutionStore.fetchBestSolution(groupId!, courseId!, taskId!, props.studentId)
    }
    useEffect(() => {
        if (!user) {
            UserService.getUserById(props.studentId).then((user) => {
                setUser(user)
                getUserBestSolution()
                setIsLoading(false)
            })
        }
    }, [])
    useEffect(() => {

    }, [user])
    /*useEffect(() => {
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
    }, [current_solution])*/

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
                        className={'task-students-list-item__image'}
                        src={user?.avatar_url}
                    />
                </SkeletonCircle>
                <SkeletonText isLoaded={!isLoading}>
                    <Text className={'task-students-list-item__text'}>
                        {`${user?.last_name} ${user?.first_name}`}
                    </Text>
                </SkeletonText>
            </HStack>
        </Button>
    );
})

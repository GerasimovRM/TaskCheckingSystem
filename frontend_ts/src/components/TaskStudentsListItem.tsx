import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import UserService from "../services/UserService";
import {Box, Text, HStack, Image, Button, SkeletonCircle, SkeletonText} from "@chakra-ui/react";
import {BaseSpinner} from "./BaseSpinner";
import {IUser} from "../models/IUser";
import {useActions} from "../hooks/useActions";

interface ITaskStudentsList {
    studentId: number;
}

export const TaskStudentsListItem: (props: ITaskStudentsList) => JSX.Element = (props: ITaskStudentsList) => {
    const [user, setUser] = useState<IUser>()
    const {courseId, groupId, lessonId, taskId} = useParams()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const {fetchBestSolution} = useActions()
    useEffect(() => {
        async function fetchUser() {
            const user = await UserService.getUserById(props.studentId)
            setUser(user)
        }
        fetchUser().then(() => setIsLoading(false))
    }, [courseId, groupId, lessonId, taskId])
    return (
        <Button width="100%" justifyContent="start"
                onClick={async () => await fetchBestSolution(groupId!, courseId!, taskId!, props.studentId)}>
            <HStack>
                <SkeletonCircle boxSize="36px" isLoaded={!isLoading}>
                    <Image
                        borderRadius="full"
                        boxSize="36px"
                        src={user?.avatar_url}
                    />
                </SkeletonCircle>
                <SkeletonText isLoaded={!isLoading}>
                    <Text>
                        {`${user?.first_name} ${user?.last_name}`}
                    </Text>
                </SkeletonText>
            </HStack>
        </Button>
    );
}

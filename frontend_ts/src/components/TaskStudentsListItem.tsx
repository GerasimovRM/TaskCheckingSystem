import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import UserService from "../services/UserService";
import {Box, Text, HStack, Image, Button, SkeletonCircle, SkeletonText} from "@chakra-ui/react";
import {BaseSpinner} from "./BaseSpinner";
import {IUser} from "../models/IUser";

interface ITaskStudentsList {
    studentId: number;
}

export const TaskStudentsListItem: (props: ITaskStudentsList) => JSX.Element = (props: ITaskStudentsList) => {
    const [user, setUser] = useState<IUser>()
    const {courseId, groupId, lessonId, taskId} = useParams()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    useEffect(() => {
        async function fetchUser() {
            const user = await UserService.getUserById(props.studentId)
            setUser(user)
        }
        fetchUser().then(() => setIsLoading(false))
    }, [courseId, groupId, lessonId, taskId])
    return (
        <div>
            <Button width="100%" alignItems="start">
                <HStack >
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
        </div>
    );
}

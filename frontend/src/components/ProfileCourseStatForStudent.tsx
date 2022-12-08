import React, {FunctionComponent, useEffect, useState} from 'react';
import {Box, Heading, HStack, Icon, SimpleGrid, useMediaQuery, VStack, Text, Spacer, Divider} from "@chakra-ui/react";

import {ICourseStat} from "../models/stat/ICourseStat";
import StatService from "../services/StatService";
import {useParams} from "react-router";
import {getTaskStatusColorScheme} from "../common/colors";
import {BorderShadowBox} from "./BorderShadowBox";

import './ProfileCourse.css'
import {BaseSpinner} from "./BaseSpinner";

const ProfileCourseStatForStudent: FunctionComponent = () => {
    const {groupId, courseId} = useParams();
    const [courseStat, setCourseStat] = useState<ICourseStat>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    useEffect(() => {
        StatService.getCourseStatForStudent(groupId!, courseId!).then((course) => {
            setCourseStat(course)
            setIsLoading(false)
        })
    }, [])

    if (isLoading) {
        return <BaseSpinner />
    }

    return (
        <VStack alignItems={"left"} className={'profile-course'}>
            {courseStat?.lessons.map((lesson) => {
                return (
                    <BorderShadowBox padding={3}>
                        <Heading size="md">{lesson.name}</Heading>
                        {lesson.tasks.map(((task) => {
                            return (
                                <>
                                    <HStack alignItems={"center"}>
                                        <Icon
                                            as={getTaskStatusColorScheme(task.status).icon}
                                            color={getTaskStatusColorScheme(task.status).iconColor}
                                            display={"flex"}
                                            w="4"
                                            h="4"
                                        />
                                        <Text>
                                            {task.name}
                                        </Text>
                                        <Spacer/>
                                        <Text>
                                            {task.best_score} / {task.max_score}
                                        </Text>
                                    </HStack>
                                    <Divider/>
                                </>
                            );
                        }))}
                    </BorderShadowBox>
                );
            })}
        </VStack>
    );

}

export default ProfileCourseStatForStudent;
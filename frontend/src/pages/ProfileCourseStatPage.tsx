import React, {FunctionComponent, useEffect, useState} from 'react';
import {Box, Heading, HStack, Icon, SimpleGrid, useMediaQuery, VStack, Text, Spacer, Divider} from "@chakra-ui/react";

import {ICourseStat} from "../models/stat/ICourseStat";
import StatService from "../services/StatService";
import {useParams} from "react-router";
import {BorderShadowBox} from "../components/BorderShadowBox";
import {IStatusTaskColor} from "../models/IStatusTaskColor";
import {getTaskStatusColorScheme} from "../common/colors";

const ProfileCourseStatPage: FunctionComponent = () => {
    const {groupId, courseId} = useParams();
    const [courseStat, setCourseStat] = useState<ICourseStat>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    useEffect(() => {
        StatService.getCourseStatForStudent(groupId!, courseId!).then((course) => {
            setCourseStat(course)
            setIsLoading(false)
        })
    }, [])
    return (
        <VStack alignItems={"left"} style={{margin: '0 2.5% 0 2.5%'}}>
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

export default ProfileCourseStatPage;
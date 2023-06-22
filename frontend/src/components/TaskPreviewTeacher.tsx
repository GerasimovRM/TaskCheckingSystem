import {Link} from 'react-router-dom';

import {Grid, GridItem, HStack, Icon, Progress, SkeletonText, Text} from '@chakra-ui/react';
import {BorderShadowBox} from "./BorderShadowBox";
import React, {useEffect, useState} from "react";
import {IconType} from 'react-icons';
import SolutionService from "../services/SolutionService";
import {useParams} from "react-router";
import { ITaskPreviewTeacher } from '../models/ITaskPreviewTeacher';
import {ISolutionCountResponse} from "../models/ISolutionCountResponse";
import { BsFillPeopleFill } from 'react-icons/all';

interface IStatus {
    iconColor: string;
    progressColor: string;
    icon: IconType;
    textStatus: string;
}

export const TaskPreviewTeacher: (props: ITaskPreviewTeacher) => JSX.Element = (props: ITaskPreviewTeacher) => {
    const [solutionsCount, setSolutionsCount] = useState<ISolutionCountResponse>()
    const {courseId, groupId, lessonId} = useParams()
    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    useEffect(() => {
        async function fetchSolution() {
            const solutionsCount = await SolutionService.getCountSolution(groupId!, courseId!, props.taskId)
            setSolutionsCount(solutionsCount)
        }
        fetchSolution().then(() => setIsLoaded(true))


    }, [courseId, groupId, lessonId])
    return (
        <Link to={`task/${props.taskId}`}>
            <BorderShadowBox padding="0.5vw" mb="5px">
                <Grid templateColumns="repeat(20, 1fr)">
                    <GridItem colSpan={10} verticalAlign="middle" ml={2}>
                        <Text fontSize="2xl">{props.taskName}</Text>
                    </GridItem>
                    <GridItem colSpan={4} colEnd={21} justifySelf={"flex-end"}>
                        <SkeletonText isLoaded={Boolean(isLoaded)}
                                      noOfLines={1}>
                            <HStack>
                                <Text
                                    align="right"
                                    color={"green.600"}
                                >
                                    <Icon
                                        as={BsFillPeopleFill}
                                        verticalAlign="middle"
                                        w="6"
                                        h="6"
                                        mr={1}
                                    />
                                    {`${solutionsCount?.solutions_complete_count}/${solutionsCount?.solutions_count}`}
                                </Text>
                                <Text
                                    align="right"
                                    color={"green.300"}
                                >
                                    <Icon
                                        as={BsFillPeopleFill}
                                        verticalAlign="middle"
                                        w="6"
                                        h="6"
                                        mr={1}
                                    />
                                    {`${solutionsCount?.solutions_complete_not_max_count}/${solutionsCount?.solutions_count}`}
                                </Text>
                                <Text
                                    align="right"
                                    color={"yellow.500"}
                                >
                                    <Icon
                                        as={BsFillPeopleFill}
                                        verticalAlign="middle"
                                        w="6"
                                        h="6"
                                        mr={1}
                                    />
                                    {`${solutionsCount?.solutions_complete_on_review_count}/${solutionsCount?.solutions_count}`}
                                </Text>
                                <Text
                                    align="right"
                                    color={"red.500"}
                                >
                                    <Icon
                                        as={BsFillPeopleFill}
                                        verticalAlign="middle"
                                        w="6"
                                        h="6"
                                        mr={1}
                                    />
                                    {`${solutionsCount?.solutions_complete_error_count}/${solutionsCount?.solutions_count}`}
                                </Text>
                                <Text
                                    align="right"
                                    color={"gray.500"}
                                >
                                    <Icon
                                        as={BsFillPeopleFill}
                                        verticalAlign="middle"
                                        w="6"
                                        h="6"
                                        mr={1}
                                    />
                                    {`${solutionsCount?.solutions_undefined_count}/${solutionsCount?.solutions_count}`}
                                </Text>
                            </HStack>
                        </SkeletonText>
                    </GridItem>
                </Grid>
                <Progress colorScheme={"const_green"}
                          size='lg'
                          borderRadius="lg"
                          value={(solutionsCount?.solutions_complete_count! + solutionsCount?.solutions_complete_not_max_count!) / solutionsCount?.solutions_count! * 100}
                          isIndeterminate={!isLoaded}
                />
            </BorderShadowBox>
        </Link>
    );
}

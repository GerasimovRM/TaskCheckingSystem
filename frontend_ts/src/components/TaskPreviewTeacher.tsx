import {Link} from 'react-router-dom';

import {Grid, GridItem, Icon, Progress, SkeletonText, Text} from '@chakra-ui/react';
import {BorderShadowBox} from "./BorderShadowBox";
import {useEffect, useState} from "react";
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
                    <GridItem colSpan={10} verticalAlign="middle">
                        <Text fontSize="2xl">{props.taskName}</Text>
                    </GridItem>
                    <GridItem colSpan={4} colEnd={21}>
                        <SkeletonText isLoaded={Boolean(isLoaded)}
                                      noOfLines={1}>
                            <Text
                                align="right"
                                mr="4"
                            >
                                <Icon
                                    as={BsFillPeopleFill}
                                    verticalAlign="middle"
                                    w="6"
                                    h="6"
                                    mr={1}
                                />
                                {`${solutionsCount?.solutions_solved_count}/${solutionsCount?.solutions_count}`}
                            </Text>
                        </SkeletonText>
                    </GridItem>
                </Grid>
                <Progress colorScheme={"green"}
                          size='lg'
                          borderRadius="lg"
                          value={solutionsCount?.solutions_solved_count! / solutionsCount?.solutions_count! * 100}
                          isIndeterminate={!isLoaded}
                />
            </BorderShadowBox>
        </Link>
    );
}

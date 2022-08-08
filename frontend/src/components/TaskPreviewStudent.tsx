import {Link} from 'react-router-dom';

import {Grid, GridItem, HStack, Icon, Progress, SkeletonCircle, SkeletonText, Text, VStack} from '@chakra-ui/react';
import {BorderShadowBox} from "./BorderShadowBox";
import {ITaskPreviewStudent} from '../models/ITaskPreviewStudent';
import {useEffect, useState} from "react";
import {ISolution} from '../models/ISolution';
import SolutionService from "../services/SolutionService";
import {useParams} from "react-router";
import { getTaskStatusColorScheme } from '../common/colors';
import {IStatusTaskColor} from "../models/IStatusTaskColor";


export const TaskPreviewStudent: (props: ITaskPreviewStudent) => JSX.Element = (props: ITaskPreviewStudent) => {
    const [solution, setSolution] = useState<ISolution | null>()
    const [status, setStatus] = useState<IStatusTaskColor>()
    const {courseId, groupId, lessonId} = useParams()
    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    useEffect(() => {
        async function fetchSolution() {
            const solution = await SolutionService.getBestSolution(groupId!, courseId!, props.taskId)
            setSolution(solution)
            setStatus(getTaskStatusColorScheme(solution?.status))
        }
        fetchSolution().then(() => setIsLoaded(true))


    }, [courseId, groupId, lessonId])
    return (
        <Link to={`task/${props.taskId}`}>
            <BorderShadowBox padding="0.5vw" mb="5px">
                <Grid templateColumns="repeat(14, 1fr)">
                    <GridItem colSpan={7} verticalAlign="middle">
                        <HStack>
                            <SkeletonCircle size="6" isLoaded={Boolean(isLoaded)}>
                                <Icon
                                    as={status?.icon}
                                    color={status?.iconColor}
                                    textAlign="center"
                                    w="6"
                                    h="6"
                                />
                            </SkeletonCircle>
                            <Text fontSize="2xl">{props.taskName}</Text>
                        </HStack>
                    </GridItem>
                    <GridItem colSpan={2} colEnd={14}>
                        <SkeletonText isLoaded={Boolean(isLoaded)}
                                      noOfLines={1}>
                            <Text
                                align="right"
                                color={status?.iconColor}
                            >
                                {`${status?.textStatus}`}
                            </Text>
                        </SkeletonText>
                    </GridItem>
                    <GridItem colSpan={1} colEnd={15}>
                        <SkeletonText isLoaded={Boolean(isLoaded)}
                                      noOfLines={1}>
                            <Text
                                align="right"
                                mr="4"
                            >
                                {`${solution?.score || 0}/${props.taskMaxScore}`}
                            </Text>
                        </SkeletonText>
                    </GridItem>
                </Grid>
                <Progress colorScheme={status ? status.progressColor: "gray"}
                          size='lg'
                          borderRadius="lg"
                          value={(solution?.score || 0) / props.taskMaxScore * 100}
                          isIndeterminate={!isLoaded}
                          isAnimated={true}
                />
            </BorderShadowBox>
        </Link>
    );
}
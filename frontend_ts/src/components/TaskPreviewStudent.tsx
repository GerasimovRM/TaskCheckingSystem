import {Link} from 'react-router-dom';

import {Grid, GridItem, Icon, Progress, SkeletonCircle, SkeletonText, Text} from '@chakra-ui/react';
import {BorderShadowBox} from "./BorderShadowBox";
import {ITaskPreviewStudent} from '../models/ITaskPreviewStudent';
import {ISolutionStatus} from "../models/ITask";
import {BsCircle, MdCheckCircle, MdRemoveCircle} from "react-icons/all";
import {useEffect, useState} from "react";
import {ISolution} from '../models/ISolution';
import {IconType} from 'react-icons';
import SolutionService from "../services/SolutionService";
import {useParams} from "react-router";
import {BaseSpinner} from "./BaseSpinner";

interface IStatus {
    iconColor: string;
    progressColor: string;
    icon: IconType;
    textStatus: string;
}

const getTaskPreviewStatus = (status: ISolutionStatus | undefined): IStatus => {
    switch (status) {
        case ISolutionStatus.ON_REVIEW:
            return {
                iconColor: 'yellow.500',
                progressColor: 'yellow',
                icon: MdRemoveCircle,
                textStatus: 'На проверке'
            }
        case ISolutionStatus.ERROR:
            return {
                iconColor: 'red.500',
                progressColor: 'red',
                icon: MdRemoveCircle,
                textStatus: 'Незачёт'
            }
        case ISolutionStatus.COMPLETE:
            return {
                iconColor: 'green.500',
                progressColor: 'green',
                icon: MdCheckCircle,
                textStatus: 'Зачёт'
            }
        case ISolutionStatus.COMPLETE_NOT_MAX:
            return {
                iconColor: 'green.500',
                progressColor: 'green',
                icon: MdCheckCircle,
                textStatus: 'Зачёт'
            }
        default:
            return {
                iconColor: 'gray.300',
                progressColor: 'gray',
                icon: BsCircle,
                textStatus: 'Не решена'
            }

    }
};

export const TaskPreviewStudent: (props: ITaskPreviewStudent) => JSX.Element = (props: ITaskPreviewStudent) => {
    const [solution, setSolution] = useState<ISolution | null>()
    const [status, setStatus] = useState<IStatus>()
    const {courseId, groupId, lessonId} = useParams()
    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    useEffect(() => {
        async function fetchSolution() {
            const solution = await SolutionService.getBestSolution(groupId!, courseId!, props.taskId)
            setSolution(solution)
            setStatus(getTaskPreviewStatus(solution?.status))
        }
        fetchSolution().then(() => setIsLoaded(true))


    }, [courseId, groupId, lessonId])
    return (
        <Link to={`task/${props.taskId}`}>
            <BorderShadowBox padding="0.5vw" mb="5px">
                <Grid templateColumns="repeat(20, 1fr)">
                    <GridItem alignSelf="center" rowSpan={1}
                              colSpan={1}>
                        <SkeletonCircle size="6" isLoaded={Boolean(isLoaded)}>
                            <Icon
                                as={status?.icon}
                                color={status?.iconColor}
                                textAlign="center"
                                w="6"
                                h="6"
                            />
                        </SkeletonCircle>
                    </GridItem>
                    <GridItem colSpan={10} verticalAlign="middle">
                        <Text fontSize="2xl">{props.taskName}</Text>
                    </GridItem>
                    <GridItem colSpan={4} colEnd={19}>
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
                    <GridItem colSpan={2} colEnd={21}>
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
                />
            </BorderShadowBox>
        </Link>
    );
}
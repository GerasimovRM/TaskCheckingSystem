import {Link} from 'react-router-dom';

import {Grid, GridItem, Icon, Progress, Text} from '@chakra-ui/react';
import {BorderShadowBox} from "./BorderShadowBox";
import {ITaskPreview} from '../models/ITaskPreview';
import {ITaskStatus} from "../models/ITask";
import {BsCircle, MdCheckCircle, MdRemoveCircle} from "react-icons/all";

const getIconByStatus = (status: ITaskStatus | undefined) => {
    switch (status) {
        case ITaskStatus.ON_REVIEW:
            return {
                iconColor: 'yellow.500',
                progressColor: 'yellow',
                icon: MdRemoveCircle,
                textStatus: 'На проверке'
            }
        case ITaskStatus.ERROR:
            return {
                iconColor: 'red.500',
                progressColor: 'red',
                icon: MdRemoveCircle,
                textStatus: 'Незачёт'
            }
        case ITaskStatus.COMPLETE:
            return {
                iconColor: 'green.500',
                progressColor: 'green',
                icon: MdCheckCircle,
                textStatus: 'Зачёт'
            }
        case ITaskStatus.COMPLETE_NOT_MAX:
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

export const TaskPreview: (props: ITaskPreview) => JSX.Element = (props: ITaskPreview) => {
    const {iconColor, icon, progressColor, textStatus} = getIconByStatus(props.taskStatus);
    return (

        <Link to={`task/${props.taskId}`}>
            <BorderShadowBox padding="0.5vw" mb="5px">
                <Grid templateColumns="repeat(20, 1fr)">
                    <GridItem alignSelf="center" rowSpan={1}
                              colSpan={1}>
                        <Icon
                            as={icon}
                            color={iconColor}
                            textAlign="center"
                            w="6"
                            h="6"
                        />
                    </GridItem>
                    <GridItem colSpan={10} verticalAlign="middle">
                        <Text fontSize="2xl">{props.taskName}</Text>
                    </GridItem>
                    <GridItem colSpan={4} colEnd={19}>
                        <Text
                            align="right"
                            color={iconColor}
                        >
                            {`${textStatus}`}
                        </Text>
                    </GridItem>
                    <GridItem colSpan={2} colEnd={21}>
                        <Text
                            align="right"
                            mr="4"
                        >
                            {`${props.taskScore || 0}/${props.taskMaxScore}`}
                        </Text>
                    </GridItem>
                </Grid>
                <Progress colorScheme={progressColor}
                          size='lg'
                          borderRadius="lg"
                          value={(props.taskScore || 0) / props.taskMaxScore * 100}
                />
            </BorderShadowBox>
        </Link>
    );
}
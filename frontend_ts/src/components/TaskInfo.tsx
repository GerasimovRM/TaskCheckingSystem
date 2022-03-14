import React from 'react';

import {Box, Stat, StatHelpText, StatLabel, StatNumber, Text,} from '@chakra-ui/react';
import {ITaskStatus} from "../models/ITask";

export interface ITaskInfo {
    status: ITaskStatus;
    points: number;
    maxPoints: number;
    date: Date;

}

export const TaskInfo: (props: ITaskInfo) => JSX.Element = (props: ITaskInfo) => {
    const theme = {
        bg: 'green.500, green.500',
        text: 'Зачтено',
    };
    if (props.status === ITaskStatus.ERROR) {
        theme.bg = 'red.500, red.500';
        theme.text = 'Доработать';
    }
    if (props.status === ITaskStatus.ON_REVIEW) {
        theme.bg = 'yellow.500, yellow.500';
        theme.text = 'На проверке';
    }
    return (
        <Box
            bgGradient={`linear(to-r, ${theme.bg})`}
            style={{
                padding: '0.2em 1em',
                borderRadius: 'var(--chakra-radii-md) var(--chakra-radii-md) 0 0',
            }}
        >
            <Stat>
                <StatLabel>
                    <Text fontSize="xl" color="white">
                        {theme.text}
                    </Text>
                </StatLabel>
                <StatNumber color="white">
                    {props.points}/{props.maxPoints}
                </StatNumber>
                <StatHelpText>
                    <Text fontSize="md" color="white">
                        Отправлено {props.date.toLocaleString()}
                    </Text>
                </StatHelpText>
            </Stat>
        </Box>
    );
}
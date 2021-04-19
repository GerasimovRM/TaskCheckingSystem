import React from 'react';

import {
  Box,
  Icon,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

export interface TaskInfoProps {
  isSuccess: boolean;
  points: number;
  maxPoints: number;
  date: Date;
}

export default function TaskInfo({
  isSuccess,
  points,
  maxPoints,
  date,
}: TaskInfoProps) {
  return (
    <Box
      bg="teal.300"
      style={{
        padding: '0.2em 1em',
        borderRadius: 'var(--chakra-radii-md) var(--chakra-radii-md) 0 0',
      }}
    >
      <Stat>
        <StatLabel>
          <Text fontSize="xl">Зачтено</Text>
        </StatLabel>
        <StatNumber>
          <Icon as={CheckIcon} /> {points}/{maxPoints}
        </StatNumber>
        <StatHelpText>
          <Text fontSize="md">Отправлено {date.toLocaleString()}</Text>
        </StatHelpText>
      </Stat>
    </Box>
  );
}

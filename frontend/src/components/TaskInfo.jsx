import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

export default function TaskInfo({ isSuccess, points, maxPoints, date }) {
  const theme = {
    bg: 'teal.500, teal.200',
    text: 'Зачтено',
  };
  if (!isSuccess) {
    theme.bg = 'red.500, red.300';
    theme.text = 'Доработать';
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
          {points}/{maxPoints}
        </StatNumber>
        <StatHelpText>
          <Text fontSize="md" color="white">
            Отправлено {date.toLocaleString()}
          </Text>
        </StatHelpText>
      </Stat>
    </Box>
  );
}

TaskInfo.propTypes = {
  isSuccess: PropTypes.bool,
  points: PropTypes.number,
  maxPoints: PropTypes.number,
  date: PropTypes.instanceOf(Date),
};

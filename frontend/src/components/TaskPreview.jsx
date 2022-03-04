import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { MdCheckCircle, MdRemoveCircle, BsCircle } from 'react-icons/all';
import { Box, Icon, Text } from '@chakra-ui/react';

const getIconByStatus = (status) => {
  switch (status) {
    case 'error':
      return ['red.500', MdRemoveCircle];
    case 'completed_not_max':
      return ['yellow.500', MdCheckCircle];
    case 'completed':
    default:
      return ['green.500', MdCheckCircle];
    case undefined:
      return ['gray.400', BsCircle];
  }
};

export default function TaskPreview({
  id,
  name,
  status,
  putHr,
  courseId,
  lessonId,
}) {
  const [iconColor, icon] = getIconByStatus(status);
  return (
    <Link to={`/course/${courseId}/lesson/${lessonId}/task/${id}`}>
      <Box borderWidth="1px" borderRadius="lg" padding="0.5vw" mb="5px">
        <Icon
          as={icon}
          color={iconColor}
          verticalAlign="text-top"
          w="6"
          h="6"
        />
        <Text fontSize="2xl" display="inline-block" ml="2">
          {name}
        </Text>
      </Box>
    </Link>
  );
}

TaskPreview.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  putHr: PropTypes.bool,
  courseId: PropTypes.number.isRequired,
  lessonId: PropTypes.number.isRequired,
};

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { MdCheckCircle, MdRemoveCircle } from 'react-icons/all';
import { ListIcon, ListItem, Text } from '@chakra-ui/react';

const getIconByStatus = (status) => {
  switch (status) {
    case 'error':
      return ['red.500', MdRemoveCircle];
    case 'completed_not_max':
      return ['green.300', MdCheckCircle];
    case 'completed':
    default:
      return ['green.500', MdCheckCircle];
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
      <ListItem>
        <Text fontSize="2xl">
          <ListIcon as={icon} color={iconColor} />
          {name}
        </Text>
        {putHr && <hr />}
      </ListItem>
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

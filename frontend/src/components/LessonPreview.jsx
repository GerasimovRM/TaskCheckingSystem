import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { ListItem, Text } from '@chakra-ui/react';

export default function LessonPreview({ groupId, courseId, lessonId, name, putHr }) {
  return (
    <Link to={`/group/${groupId}/course/${courseId}/lesson/${lessonId}`}>
      <ListItem>
        <Text
          fontSize="3xl"
          style={{
            textTransform: 'capitalize',
          }}
        >
          {name}
        </Text>
        {putHr && <hr />}
      </ListItem>
    </Link>
  );
}

LessonPreview.propTypes = {
  groupId: PropTypes.number.isRequired,
  lessonId: PropTypes.number.isRequired,
  courseId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  putHr: PropTypes.bool,
};

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { ListItem, Text } from '@chakra-ui/react';

export default function LessonPreview({ id, courseId, name, putHr }) {
  return (
    <Link to={`/course/${courseId}/lesson/${id}`}>
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
  id: PropTypes.number.isRequired,
  courseId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  putHr: PropTypes.bool,
};

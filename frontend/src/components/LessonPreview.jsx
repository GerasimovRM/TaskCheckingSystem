import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Box, Text } from '@chakra-ui/react';

export default function LessonPreview({
  groupId,
  courseId,
  lessonId,
  name,
}) {
  return (
    <Link to={`/group/${groupId}/course/${courseId}/lesson/${lessonId}`}>
      <Box borderWidth="1px" borderRadius="lg" padding="0.5vw" mb="5px">
        <Text
          fontSize="2xl"
          style={{
            textTransform: 'capitalize',
          }}
        >
          {name}
        </Text>
      </Box>
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

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Box, Stat, StatNumber, StatHelpText } from '@chakra-ui/react';

export default function CoursePreview({
  groupId,
  courseId,
  courseName,
  groupName
}) {
  return (
    <Link to={`group/${groupId}/course/${courseId}`}>
      <Box borderWidth="1px" borderRadius="lg" maxW="sm" padding="1vw">
        <Stat>
          <StatNumber>{courseName}</StatNumber>
          <StatHelpText>{groupName}</StatHelpText>
        </Stat>
      </Box>
    </Link>
  );
}

CoursePreview.propTypes = {
  courseId: PropTypes.number.isRequired,
  groupId: PropTypes.number.isRequired,
  courseName: PropTypes.string.isRequired,
  groupName: PropTypes.string.isRequired,
};

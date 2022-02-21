import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Box, Stat, StatNumber, StatHelpText } from '@chakra-ui/react';

export default function CoursePreview({
  groupId,
  courseId,
  name,
  description,
}) {
  return (
    <Link to={`group/${groupId}/course/${courseId}`}>
      <Box borderWidth="1px" borderRadius="lg" maxW="sm" padding="1vw">
        <Stat>
          <StatNumber>{name}</StatNumber>
          <StatHelpText>{description}</StatHelpText>
        </Stat>
      </Box>
    </Link>
  );
}

CoursePreview.propTypes = {
  courseId: PropTypes.number.isRequired,
  groupId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

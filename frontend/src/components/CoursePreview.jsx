import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Box, Stat, StatNumber, StatHelpText } from '@chakra-ui/react';

export default function CoursePreview({ id, name, description }) {
  return (
    <Link to={`/course/${id}`}>
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
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

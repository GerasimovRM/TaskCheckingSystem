import React from 'react';

import { Spinner } from '@chakra-ui/react';

export default function Spinner() {
  return (
    <Spinner
      thickness="4px"
      speed='0.65s'
      emptyColor="gray.200"
      color='red.400'
      size='xl'
    />
  );
}



import React from 'react';

import { Box, Text } from '@chakra-ui/react';

export interface ChatBlobProps {
  name: string;
  text: string;
  isSelf?: boolean;
}

export default function ChatBlob({ name, text, isSelf }: ChatBlobProps) {
  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderRadius="md"
      style={{
        padding: '0.5em',
      }}
    >
      <Box
        color="gray.500"
        fontWeight="semibold"
        letterSpacing="wide"
        fontSize="xs"
      >
        {name}
      </Box>
      <Text>{text}</Text>
    </Box>
  );
}

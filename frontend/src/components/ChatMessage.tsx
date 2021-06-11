import React from 'react';

import { Box, Flex, Image } from '@chakra-ui/react';

import ChatBlob from './ChatBlob';

export interface ChatMessageProps {
  userId: number;
  text: string;
}

export default function ChatMessage({ userId, text }: ChatMessageProps) {
  // Будет получено из mobx
  const image = 'https://avatars.githubusercontent.com/u/26022093?v=4';
  const clientId = 1;
  const clientName = 'Dungeon Master';

  return (
    <Flex
      style={{
        marginBottom: '1vh',
      }}
    >
      <Box flex="1">
        {clientId !== userId ? (
          <Flex>
            <Box>
              <Image borderRadius="full" boxSize="32px" src={image} />
            </Box>
            <Box
              flex="1"
              style={{
                paddingLeft: '0.2em',
              }}
            >
              <ChatBlob name={clientName} text={text} isSelf />
            </Box>
            <Box w="3vw" />
          </Flex>
        ) : (
          <Flex>
            <Box w="3vw" />
            <Box flex="1">
              <ChatBlob name={clientName} text={text} />
            </Box>
          </Flex>
        )}
      </Box>
    </Flex>
  );
}

import React from 'react';
import { Flex, Box, Heading } from '@chakra-ui/react';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

import TaskInfo from '../components/TaskInfo';
import Chat from '../components/Chat';

export default function TaskPage() {
  return (
    <Flex>
      <Box flex="1" borderRadius="md" h="75vh">
        <Flex direction="column">
          <TaskInfo isSuccess points={80} maxPoints={100} date={new Date()} />
          <Box flex="1">
            <SyntaxHighlighter
              language="python"
              style={darcula}
              showLineNumbers
              wrapLongLines
              customStyle={{
                margin: '0',
                borderRadius:
                  '0 0 var(--chakra-radii-md) var(--chakra-radii-md)',
                height: '100%',
              }}
            >
              avar = 1
            </SyntaxHighlighter>
          </Box>
        </Flex>
      </Box>
      <Box w="3%" />
      <Box w="25%" h="75vh" bg="gray.50" borderRadius="md">
        <Flex direction="column" h="100%">
          <Box
            w="100%"
            bgGradient="linear(to-r, teal.200, cyan.700)"
            borderRadius="md"
            style={{
              padding: '1vh 0',
              borderRadius: 'var(--chakra-radii-md) var(--chakra-radii-md) 0 0',
            }}
          >
            <Heading size="lg" align="center" color="white">
              Чат
            </Heading>
          </Box>
          <Box flex="1" h="100%">
            <Chat />
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}

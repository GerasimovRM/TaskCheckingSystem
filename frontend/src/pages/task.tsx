import React from 'react';
import { Flex, Box } from '@chakra-ui/react';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

import TaskInfo from '../components/TaskInfo';

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
      <Box w="22%" h="75vh" bg="gray.100" borderRadius="md">
        123
      </Box>
    </Flex>
  );
}

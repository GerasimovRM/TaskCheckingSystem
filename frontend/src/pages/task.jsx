import React from 'react';
import { useParams } from 'react-router';
import {
  Text,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Flex,
} from '@chakra-ui/react';

import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import TaskAttachment from '../components/TaskAttachment';
import TaskInfo from '../components/TaskInfo';
import Chat from '../components/Chat';

export default function TaskPage() {
  const { courseId, lessonId, taskId } = useParams();

  const taskInfo = {
    id: taskId,
    name: 'Task name',
    description: `
      Hey buddy, I think you've got the wrong door, the leather club's two blocks down.
      Fuck↗You↘
      Oh, Fuck♂You leather man. Maybe you and I should settle it right here on the ring if you think your so tough.
      Oh yea? I'll kick your ass!
      Ha! Yeah right man. Let's go! Why don't you get out of that leather stuff? I'll strip down out of this and we'll settle it right here in the ring. What do you say?
      Yeah, no problem buddy!
      You got it. Get out of that uh, jabroni outfit.
      Yeah, smart ass.
      I'll show you who's the boss of this gym.
    `.trim(),
    attachments: [
      {
        attachment_type: 'input_output',
        data: {
          input: ['123', 'dfgdfg', 'bucks'],
          output: ['bucks', 'dfgdfg', '123'],
        },
      },
      {
        attachment_type: 'image',
        data: {
          url: 'https://avatars.githubusercontent.com/u/26022093?v=4',
        },
      },
    ],
    solution: {
      status: 'completed_not_max',
      points: 80,
      max_points: 100,
      date: new Date(),
      code: 'shit = 1\n\n\ndef a():\n    print(123)\n',
    },
  };
  return (
    <div>
      <Heading>{taskInfo.name}</Heading>
      <Tabs>
        <TabList>
          <Tab>Условие задачи</Tab>
          <Tab isDisabled={taskInfo.solution === null}>Решение</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Text fontSize="lg">{taskInfo.description}</Text>
            <br />
            {taskInfo.attachments && taskInfo.attachments.length > 0 && (
              <Heading>Вложения</Heading>
            )}
            {taskInfo.attachments.map((v) => (
              <div
                style={{
                  paddingBottom: '2vh',
                }}
              >
                <TaskAttachment type={v.attachment_type} data={v.data} />
              </div>
            ))}
          </TabPanel>
          <TabPanel>
            <Flex>
              <Box flex="1" borderRadius="md" h="75vh">
                <Flex direction="column">
                  <TaskInfo
                    isSuccess={taskInfo.solution.status !== 'error'}
                    points={taskInfo.solution.points}
                    maxPoints={taskInfo.solution.max_points}
                    date={taskInfo.solution.date}
                  />
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
                      {taskInfo.solution.code}
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
                      borderRadius:
                        'var(--chakra-radii-md) var(--chakra-radii-md) 0 0',
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
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

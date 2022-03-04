import React from 'react';
import { useParams } from 'react-router';
import { Heading, List } from '@chakra-ui/react';

import TaskPreview from '../components/TaskPreview';

export default function LessonPage() {
  const { courseId, lessonId } = useParams();
  const lessonInfo = {
    name: `Lesson name ${lessonId}`,
    tasks: [
      {
        id: 1,
        name: 'Task name',
        status: 'completed',
      },
      {
        id: 2,
        name: 'My fellow brothers',
        status: 'completed_not_max',
      },
      {
        id: 3,
        name: 'My name is Billy Herington',
        status: 'error',
      },
      {
        id: 4,
        name: 'My name is Tema Kanalincev, da?',
      },
    ],
  };

  return (
    <>
      <Heading>{lessonInfo.name}</Heading>
      <br />
        {lessonInfo.tasks.map((v, i) => (
          <TaskPreview
            status={v.status}
            id={v.id}
            name={v.name}
            lessonId={lessonId}
            courseId={courseId}
            putHr={lessonInfo.tasks && i < lessonInfo.tasks.length - 1}
          />
        ))}
    </>
  );
}

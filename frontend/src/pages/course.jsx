import React from 'react';
import { useParams } from 'react-router';

import { List } from '@chakra-ui/react';
import LessonPreview from '../components/LessonPreview';

export default function CoursePage() {
  const { id } = useParams();
  const lessons = [
    {
      id: 1,
      name: 'lesson 1',
    },
    {
      id: 2,
      name: 'lesson 2',
    },
    {
      id: 3,
      name: 'lesson 3',
    },
  ];
  return (
    <List spacing={3}>
      {lessons.map((v, i) => (
        <>
          <LessonPreview
            id={v.id}
            name={v.name}
            status={v.status}
            courseId={id}
            key={v.id}
            putHr={i !== lessons.length - 1}
          />
        </>
      ))}
    </List>
  );
}

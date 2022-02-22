import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { List } from '@chakra-ui/react';
import { createApi, baseApi } from '../api/api';

import LessonPreview from '../components/LessonPreview';
import BaseSpinner from '../components/BaseSpinner';

const { get } = createApi(`${baseApi}/page_data`);

export default function CoursePage() {
  const { courseId, groupId } = useParams();
  const [lessons, setLessons] = useState([]);

  useEffect(async () => {
    const response = await get(`/group/${groupId}/course/${courseId}/lessons`);
    setLessons(response.json);
  }, []);
  if (lessons.length !== 0)
    return (
      <List spacing={3}>
        {lessons.map((v, i) => (
          <>
            <LessonPreview
              groupId={groupId}
              lessonId={v.id}
              name={v.name}
              status={v.status}
              courseId={courseId}
              key={v.id}
              putHr={i !== lessons.length - 1}
            />
          </>
        ))}
      </List>
    );
  return <BaseSpinner />;
}

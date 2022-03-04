import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  List,
} from '@chakra-ui/react';
import { createApi, baseApi } from '../api/api';

import LessonPreview from '../components/LessonPreview';
import BaseSpinner from '../components/BaseSpinner';

const { get } = createApi(`${baseApi}/page_data`);

export default function CoursePage() {
  const { courseId, groupId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');

  useEffect(async () => {
    const response = await get(`/group/${groupId}/course/${courseId}/lessons`);
    setLessons(response.json.lessons);
    setCourseName(response.json.course_name);
    setCourseDescription(response.json.course_description);
  }, []);
  if (lessons.length !== 0)
    return (
      <div>
        <Accordion allowMultiple>
          <AccordionItem borderBottom="none" borderTop="none">
            <AccordionButton borderWidth="1px" borderRadius="lg" padding="1vw">
              <Box flex="1" textAlign="left">
                <Heading>{courseName}</Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              {courseDescription}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        <Heading padding="1vw">Уроки</Heading>
        {lessons.map((v) => (
          <>
            <LessonPreview
              groupId={groupId}
              lessonId={v.id}
              name={v.name}
              status={v.status}
              courseId={courseId}
              key={v.id}
            />
          </>
        ))}
      </div>
    );
  return <BaseSpinner />;
}

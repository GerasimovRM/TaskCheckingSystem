import React, { useEffect, useState } from 'react';
import { SimpleGrid, useMediaQuery, Heading } from '@chakra-ui/react';

import CoursePreview from '../components/CoursePreview';
import { createApi, baseApi } from '../api/api';
import BaseSpinner from '../components/BaseSpinner';

const {get} = createApi(`${baseApi}/page_data`);

export default function CoursesPage() {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    (async () => {
      const getGroups = async () => {
        const response = await get('/groups');
        const data = response.json;
        return data;
      };
      const getCourses = async (groups) => {
        let result = [];
        for (const group of groups) {
          const response = await get(`/group/${group.id}/courses`);
          const sub_result = response.json.map((v) => {
            return { ...v, groupId: group.id };
          });
          result = result.concat(sub_result);
        }
        setCourses(result);
      };
      const groupsResponse = await getGroups();
      await getCourses(groupsResponse);
    })();
  }, []);

  const previews = courses.map((v) => (
    <CoursePreview
      description={v.description}
      name={v.name}
      courseId={v.id}
      groupId={v.groupId}
      key={v.id}
    />
  ));
  if (courses.length !== 0)
    return isLargerThan768 ? (
      <div>
        <Heading mb={5}>Курсы</Heading>
        <SimpleGrid columns={4} spacing={10}>
          {previews}
        </SimpleGrid>
      </div>
    ) : (
      <div>
        <Heading mb={2}>Курсы</Heading>
        {previews.map((v) => (
          <>
            {v}
            <br />
          </>
        ))}
      </div>
    );
  return <BaseSpinner />;
}

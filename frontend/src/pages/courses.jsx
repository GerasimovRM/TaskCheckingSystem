import React, { useEffect, useState } from 'react';
import { SimpleGrid, useMediaQuery, Heading } from '@chakra-ui/react';

import CoursePreview from '../components/CoursePreview';
import { createApi, baseApi } from '../api/api';
import BaseSpinner from '../components/BaseSpinner';

const {get} = createApi(`${baseApi}/page_data`);

export default function CoursesPage() {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [courses, setCourses] = useState();

  useEffect(() => {
    (async () => {
      const getCourses = async (groups) => {
        let result = [];
        for (const group of groups) {
          const response = await get(`/group/${group.id}/courses`);
          const sub_result = response.json.courses.map((v) => {
            return { ...v, groupId: group.id, groupName: group.name };
          });
          result = result.concat(sub_result);
        }
        return result;
      };
      const groupsResponse = await get('/groups');
      if (groupsResponse.req.status === 200) {
        const courses = await getCourses(groupsResponse.json);
        setCourses(courses);
      }
      else {
        setCourses([]);
      }
    })();
  }, []);

  if (courses === undefined) {
    return <BaseSpinner />;
  }
  if (courses.length !== 0) {
    const previews = courses.map((v) => (
      <CoursePreview
        courseName={v.name}
        groupName={v.groupName}
        courseId={v.id}
        groupId={v.groupId}
        key={v.id}
      />
    ));
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
  }
  return (
    <div>
      <Heading>Нет доступных курсов</Heading>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { SimpleGrid, useMediaQuery } from '@chakra-ui/react';

import CoursePreview from '../components/CoursePreview';
import { createApi, baseApi } from '../api/api';

const {get} = createApi(baseApi);

export default function CoursesPage() {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    (async () => {
      const getGroups = async () => {
        const response = await get('/user/groups');
        const data = response.json;
        return data;
      };
      const getCourses = async (groups) => {
        let result = [];
        for (const group of groups) {
          const response = await get(`/user/group/${group.id}/courses`);
          result = result.concat(response.json);
        }
        setCourses(result);
      };
      const groupsResponse = await getGroups();
      await getCourses(groupsResponse);
    })();
  }, []);

  console.log(courses);

  // const courses = groups;
  /*
  const courses = [
    {
      id: 1,
      name: 'course 1',
      description: "fucking slaves 123 1231 23 oh shit i'm sorry",
    },
    {
      id: 2,
      name: 'course 2',
      description: "fucking slaves 123 1231 23 oh shit i'm sorry",
    },
    {
      id: 3,
      name: 'course 3',
      description: "fucking slaves 123 1231 23 oh shit i'm sorry",
    },
  ];*/
  const previews = courses.map((v) => (
    <CoursePreview
      description={v.description}
      name={v.name}
      id={v.id}
      key={v.id}
    />
  ));
  return isLargerThan768 ? (
    <SimpleGrid columns={4} spacing={10}>
      {previews}
    </SimpleGrid>
  ) : (
    <div>
      {previews.map((v) => (
        <>
          {v}
          <br />
        </>
      ))}
    </div>
  );
}

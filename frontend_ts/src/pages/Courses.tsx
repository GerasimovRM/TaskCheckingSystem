import React, {FunctionComponent, useEffect, useState} from 'react';
import { SimpleGrid, useMediaQuery, Heading } from '@chakra-ui/react';
import CourseService from "../api/CourseService";

export const CoursesPage: FunctionComponent = () => {
    const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
    const [courses, setCourses] = useState();

    useEffect(() => {
        const groups = CourseService.getGroups()
        const res = 3;
    }, []);
    /*
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
     */
    return (
        <div>
            <Heading>Нет доступных курсов</Heading>
        </div>
    );
}

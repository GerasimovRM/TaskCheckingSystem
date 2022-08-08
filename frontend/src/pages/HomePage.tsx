import React, {FunctionComponent, useEffect, useState} from 'react';
import {Heading, SimpleGrid, useMediaQuery} from "@chakra-ui/react";
import {BaseSpinner} from "../components/BaseSpinner";
import {CoursePreview} from "../components/CoursePreview";
import {ICoursePreview} from "../models/ICoursePreview";
import {useTypedSelector} from "../hooks/useTypedSelector";
import GroupService from "../services/GroupService";
import CourseService from "../services/CourseService";

const HomePage: FunctionComponent = () => {
    const [coursePreviews, setCoursePreviews] = useState<ICoursePreview[]>([])
    const [isLargerThan768] = useMediaQuery('(min-width: 768px)')
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const {isAuth} = useTypedSelector(state => state.auth)
    useEffect(() => {
        async function fetchCourses() {
            const group_response = await GroupService.getGroups()
            const courses_data = await Promise.all(group_response.groups.map((group) => CourseService.getCourses(group.id)))
            const courses = courses_data.map(
                (course_data, index) => course_data.courses.map(
                    (course): ICoursePreview => {
                        return {
                            linkTo: `group/${course.id}/course/${group_response.groups[index].id}`,
                            courseId: course.id,
                            courseName: course.name,
                            groupName: group_response.groups[index].name,
                            groupId: group_response.groups[index].id
                        }
                    })).flat().sort((a, b) => a.courseId - b.courseId)
            setCoursePreviews(courses)
        }
        if (isAuth) {
            fetchCourses()
                .then(() => setIsLoading(false))
        }

    }, [isAuth])

    if (isLoading) {
        return <BaseSpinner/>;
    } else {
        if (coursePreviews.length !== 0) {
            const previews = coursePreviews.map((v, index) => (
                <CoursePreview
                    {...v}
                    key={index}
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
                    <SimpleGrid columns={4} spacing={10}>
                        {previews}
                    </SimpleGrid>
                </div>
            );
        }
        return (
            <div>
                <Heading>Нет доступных курсов</Heading>
            </div>
        );
    }
}

export default HomePage;
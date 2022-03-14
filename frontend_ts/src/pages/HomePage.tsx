import React, {FunctionComponent, useEffect, useState} from 'react';
import PageDataService from "../api/PageDataService";
import {Heading, SimpleGrid, useMediaQuery} from "@chakra-ui/react";
import {BaseSpinner} from "../components/BaseSpinner";
import {CoursePreview} from "../components/CoursePreview";
import {ICoursePreview} from "../models/ICoursePreview";
import {useTypedSelector} from "../hooks/useTypedSelector";

const HomePage: FunctionComponent = () => {
    const [coursePreviews, setCoursePreviews] = useState<ICoursePreview[]>([])
    const [isLargerThan768] = useMediaQuery('(min-width: 768px)')
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const {isAuth} = useTypedSelector(state => state.auth)
    useEffect(() => {
        async function fetchCourses() {
            const groups = await PageDataService.getGroups()
            const courses_data = await Promise.all(groups.map((group) => PageDataService.getGroupCourses(group.id)))
            const courses = courses_data.map(
                (course_data, index) => course_data.map(
                    (course): ICoursePreview => {
                        return {
                            courseId: course.id,
                            courseName: course.name,
                            groupName: groups[index].name,
                            groupId: groups[index].id
                        }
                    })).flat()
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
            const previews = coursePreviews.map((v) => (
                <CoursePreview
                    {...v}
                    key={v.courseId}
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
                            <br/>
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
}

export default HomePage;
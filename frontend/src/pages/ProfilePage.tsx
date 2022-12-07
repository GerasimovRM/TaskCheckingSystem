import React, {FunctionComponent, useEffect, useState} from 'react';
import {Heading, SimpleGrid, useMediaQuery} from "@chakra-ui/react";
import {BaseSpinner} from "../components/BaseSpinner";
import {CoursePreview} from "../components/CoursePreview";
import {ICoursePreview} from "../models/ICoursePreview";
import {useTypedSelector} from "../hooks/useTypedSelector";
import GroupService from "../services/GroupService";
import CourseService from "../services/CourseService";

import './ProfilePage.css';

const ProfilePage: FunctionComponent = () => {
    const [coursePreviews, setCoursePreviews] = useState<ICoursePreview[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

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

    useEffect(() => {
        fetchCourses()
            .then(() => setIsLoading(false))
    }, [])

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
            return (
                <main className={'profile-page'}>
                    <Heading mb={5}>Курсы</Heading>
                    <SimpleGrid columns={4} spacing={10} >
                        {previews}
                    </SimpleGrid>
                </main>
            )
        }
        return (
            <main>
                <Heading>Нет доступных курсов</Heading>
            </main>
        );
    }
}

export default ProfilePage;
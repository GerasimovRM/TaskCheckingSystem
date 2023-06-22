import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Heading, SimpleGrid, useMediaQuery} from "@chakra-ui/react";
import {BaseSpinner} from "../components/BaseSpinner";
import {CoursePreview} from "../components/CoursePreview";
import {ICoursePreview} from "../models/ICoursePreview";
import GroupService from "../services/GroupService";
import CourseService from "../services/CourseService";
import {Layout} from "../components/layouts/Layout";
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../context';

const HomePage: FunctionComponent = observer(() => {
    const RS = useContext(RootStoreContext);
    const [coursePreviews, setCoursePreviews] = useState<ICoursePreview[]>([])
    const [isLargerThan768] = useMediaQuery('(min-width: 768px)')
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const {isAuth} = RS.authStore;
    useEffect(() => {
        async function fetchCourses() {
            const group_response = await GroupService.getGroups()
            const courses_data = await Promise.all(group_response.groups.map((group) => CourseService.getCourses(group.id)))
            const courses = courses_data.map(
                (course_data, index) => course_data.courses.map(
                    (course): ICoursePreview => {
                        return {
                            linkTo: `group/${group_response.groups[index].id}/course/${course.id}`,
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
                <Layout
                    headerChildren={
                        <Heading>Курсы</Heading>
                    }
                    mainChildren={
                        <SimpleGrid columns={4} spacing={4}>
                            {previews}
                        </SimpleGrid>
                    }
                />
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
            <Layout
                headerChildren={
                    <Heading>Курсы</Heading>
                }
                mainChildren={
                    <Heading>Нет доступных курсов</Heading>
                }
            />
        );
    }
})

export default HomePage;
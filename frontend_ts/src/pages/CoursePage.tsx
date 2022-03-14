import React, {FunctionComponent, useEffect, useState} from 'react';
import { useParams } from 'react-router';

import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Heading,
} from '@chakra-ui/react';

import PageDataService from "../api/PageDataService";
import {ICoursePageData} from "../models/ICoursePageData";
import {BaseSpinner} from "../components/BaseSpinner";
import {LessonPreview} from "../components/LessonPreview";



const CoursePage: FunctionComponent = () => {
    const {courseId, groupId} = useParams();
    const [coursePageData, setCoursePageData] = useState<ICoursePageData>()
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        async function fetchLessons() {
            const coursePageDataResponse = await PageDataService.getGroupCourseLessons(groupId!, courseId!)
            setCoursePageData(coursePageDataResponse)
        }

        fetchLessons()
            .then(() => setIsLoading(false))

    }, [courseId, groupId]);
    if (isLoading)
        return <BaseSpinner />;
    //if (coursePageData?.lessons.length !== 0)
        return (
            <div>
                <Accordion allowMultiple>
                    <AccordionItem borderBottom="none" borderTop="none">
                        <AccordionButton borderWidth="1px" borderRadius="lg" padding="1vw">
                            <Box flex="1" textAlign="left">
                                <Heading>{coursePageData?.course_name}</Heading>
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                            {coursePageData?.course_description}
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
                <Heading padding="1vw">Уроки</Heading>
                {coursePageData?.lessons.map((v) => (
                    <LessonPreview
                        groupId={groupId!}
                        lessonId={v.id}
                        name={v.name}
                        courseId={courseId!}
                        key={v.id}
                    />
                ))}
            </div>
        );
}

export default CoursePage
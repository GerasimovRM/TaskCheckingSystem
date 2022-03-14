import React, {FunctionComponent, useEffect, useState} from 'react';
import { useParams } from 'react-router';

import {
    Accordion,
    AccordionButton, AccordionIcon,
    AccordionItem, AccordionPanel, Box,
    Heading,
} from '@chakra-ui/react';


import PageDataService from "../api/PageDataService";
import {BaseSpinner} from "../components/BaseSpinner";
import {TaskPreview} from "../components/TaskPreview";
import {ILessonPageData} from "../models/ILessonPageData";



const LessonPage: FunctionComponent = () => {
    const {courseId, groupId, lessonId} = useParams();
    const [tasksPageData, setTasksPageData] = useState<ILessonPageData>()
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        async function fetchTasks() {
            const tasksDataResponse = await PageDataService.getGroupCourseLessonTasks(groupId!, courseId!, lessonId!)
            setTasksPageData(tasksDataResponse)
            console.log(tasksDataResponse)
        }

        fetchTasks()
            .then(() => {
                setIsLoading(false)

            })
    }, [courseId, groupId, lessonId])

    if (isLoading) {
        return <BaseSpinner />
    } else {
        return (
            <div>
                <Accordion allowMultiple>
                    <AccordionItem borderBottom="none" borderTop="none">
                        <AccordionButton borderWidth="1px" borderRadius="lg" padding="1vw">
                            <Box flex="1" textAlign="left">
                                <Heading>{tasksPageData?.lesson_name}</Heading>
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                            {tasksPageData?.lesson_description}
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
                <Heading padding="1vw">Задачи</Heading>
                {tasksPageData?.tasks.map((v) => (
                    <TaskPreview key={v.id}
                                 taskId={v.id}
                                 taskName={v.name}
                                 taskMaxScore={v.max_score}
                                 taskScore={v.score}
                                 taskStatus={v.status}
                    />
                ))}
            </div>
        )
    }
}

export default LessonPage
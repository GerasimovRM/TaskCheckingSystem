import React, {FunctionComponent, useEffect, useState} from 'react';
import {useParams} from 'react-router';

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
import {BaseSpinner} from "../components/BaseSpinner";
import {TaskPreview} from "../components/TaskPreview";
import {ILessonPageData} from "../models/ILessonPageData";
import {ISolution, ITaskStatus} from "../models/ITask";


const LessonPage: FunctionComponent = () => {
    const {courseId, groupId, lessonId} = useParams();
    const [tasks, setTasks] = useState<ILessonPageData>()
    const [solutions, setSolutions] = useState<ISolution[]>()
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        async function fetchTasks() {
                const tasksDataResponse = await PageDataService.getGroupCourseLessonTasks(groupId!, courseId!, lessonId!)
                setTasks(tasksDataResponse)
                const solutionsDataResponse = await Promise.all(tasksDataResponse.tasks.map((task) => PageDataService.getTaskSolutions(groupId!, courseId!, task.id, true)))
                setSolutions(solutionsDataResponse.flat())
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
                                <Heading>{tasks?.lesson_name}</Heading>
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                            {tasks?.lesson_description}
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
                <Heading padding="1vw">Задачи</Heading>
                {tasks?.tasks.map((task, i) => (
                    <TaskPreview key={task.id}
                                 taskId={task.id}
                                 taskName={task.name}
                                 taskMaxScore={task.max_score}
                                 taskScore={solutions && solutions[i] && solutions[i].score}
                                 taskStatus={solutions && solutions[i] && solutions[i].status}
                    />
                ))}
            </div>
        )
    }
}

export default LessonPage
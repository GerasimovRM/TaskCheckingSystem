import { Link } from 'react-router-dom';

import { Box, Stat, StatNumber, StatHelpText } from '@chakra-ui/react';
import {ICoursePreview} from "../models/ICoursePreview";

export const CoursePreview: (props: ICoursePreview) => JSX.Element = (props: ICoursePreview) => {
    return (
        <div>
            <Link to={`group/${props.groupId}/course/${props.courseId}`}>
                <Box borderWidth="1px" borderRadius="lg" maxW="sm" padding="1vw">
                    <Stat>
                        <StatNumber>{props.courseName}</StatNumber>
                        <StatHelpText>{props.groupName}</StatHelpText>
                    </Stat>
                </Box>
            </Link>
        </div>
    );
}
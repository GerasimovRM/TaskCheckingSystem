import {Link} from 'react-router-dom';

import {Stat, StatNumber, StatHelpText} from '@chakra-ui/react';
import {BorderShadowBox} from "./BorderShadowBox";
import {ICoursePreview} from '../models/ICoursePreview';

export const CoursePreview: (props: ICoursePreview) => JSX.Element = (props: ICoursePreview) => {
    return (
        <div>
            <Link to={`${props.linkTo}`}>
                <BorderShadowBox maxW="sm" padding="1vw">
                    <Stat>
                        <StatNumber>{props.courseName}</StatNumber>
                        <StatHelpText>{props.groupName}</StatHelpText>
                    </Stat>
                </BorderShadowBox>
            </Link>
        </div>
    );
}
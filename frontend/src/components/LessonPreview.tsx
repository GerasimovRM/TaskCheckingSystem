import { Link } from 'react-router-dom';

import {Text} from '@chakra-ui/react';
import {ILessonPreview} from "../models/ILessonPreview";
import {BorderShadowBox} from "./BorderShadowBox";

export const LessonPreview: (props: ILessonPreview) => JSX.Element = (props: ILessonPreview) => {
    return (
        <div>
            <Link to={`lesson/${props.lessonId}`}>
                <BorderShadowBox padding="0.5vw">
                    <Text
                        ml="2"
                        fontSize="2xl"
                        style={{
                            textTransform: 'capitalize',
                        }}
                    >
                        {props.name}
                    </Text>
                </BorderShadowBox>
            </Link>
        </div>
    );
}
import {ILesson} from "./ILesson";

export interface ICoursePageData {
    lessons: ILesson[];
    course_name: string;
    course_description: string;
}
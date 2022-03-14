import {ITask} from "./ITask";

export interface ILessonPageData {
    tasks: ITask[];
    lesson_name: string;
    lesson_description: string;
}
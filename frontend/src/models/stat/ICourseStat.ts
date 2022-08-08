import {ILessonStat} from "./ILessonStat";

export interface ICourseStat {
    id: number | string;
    name: string;
    lessons: ILessonStat[];
}
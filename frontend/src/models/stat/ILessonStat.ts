import {ITaskStat} from "./ITaskStat";

export interface ILessonStat {
    id: number | string;
    name: string;
    tasks: ITaskStat[];
}
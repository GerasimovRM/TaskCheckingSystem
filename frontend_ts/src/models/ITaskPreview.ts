import {ITaskStatus} from "./ITask";

export interface ITaskPreview {
    taskId: string | number;
    taskName: string;
    taskScore?: number;
    taskMaxScore: number;
    taskStatus?: ITaskStatus;
}
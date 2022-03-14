import {IAttachmentTask} from "./IAttachmentTask";

export enum ITaskStatus {
    COMPLETE = 2,
    COMPLETE_NOT_MAX = 1,
    ERROR = -1,
    ON_REVIEW = 0
}

export interface ISolution {
    score: number;
    code: string;
    status: ITaskStatus;
    time_start: Date;
    time_finish?: Date;
}

export interface ITask {
    id: number | string;
    name: string;
    description: string | null;
    max_score: number;
    score?: number;
    status?: ITaskStatus
}

export interface ITaskWithSolution {
    id: number | string;
    name: string;
    description: string | null;
    max_score: number;
    attachments: IAttachmentTask[];
    solution: ISolution;
}
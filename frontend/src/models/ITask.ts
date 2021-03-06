import {IAttachmentTask} from "./IAttachmentTask";

export enum ISolutionStatus {
    COMPLETE = 2,
    COMPLETE_NOT_MAX = 1,
    ERROR = -1,
    ON_REVIEW = 0,
    UNDEFINED = -2
}

export interface ITask {
    id: number | string;
    name: string;
    description: string | null;
    max_score: number;
    attachments: IAttachmentTask[];
}
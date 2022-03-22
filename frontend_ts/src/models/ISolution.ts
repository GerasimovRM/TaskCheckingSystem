import {ISolutionStatus} from "./ITask";

export interface ISolution {
    id: number | string
    score: number;
    code: string;
    status: ISolutionStatus;
    time_start: Date;
    time_finish?: Date;
}
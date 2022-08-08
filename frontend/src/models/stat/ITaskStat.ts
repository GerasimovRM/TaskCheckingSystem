import {ISolutionStatus} from "../ITask";

export interface ITaskStat {
    id: number | string;
    name: string;
    max_score: number;
    best_score: number;
    status: ISolutionStatus
}
import {ISolutionStatus} from "./ITask";

export interface IStudentWithSolution {
    user_id: number;
    score: number;
    status: ISolutionStatus;
    time_start: Date;
    time_finish: Date | null;
}
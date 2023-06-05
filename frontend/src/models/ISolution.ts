import {ISolutionStatus} from "./ITask";
import {ITestType} from "./ITestType";


export interface ISolution {
    id: number | string
    score: number;
    code: string;
    status: ISolutionStatus;
    time_start: Date;
    time_finish?: Date;
    check_system_answer?: string;
    test_type: ITestType;
    input_data?: string;
    except_answer?: string;
    user_answer?: string;
    unit_test_code?: string;
}
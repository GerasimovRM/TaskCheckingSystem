import {ISolutionStatus} from "../ITask";
import {IUser} from "../IUser";

interface ITaskStudentDataForTeacher {
    task_id: number
    best_score: number
    status: ISolutionStatus
}

interface ITaskLessonDataForTeacher {
    task_id: number
    task_name: string
    max_score: number
}

interface ILessonDataForTeacher {
    lesson_id: number
    lesson_name: string
    tasks: ITaskLessonDataForTeacher[]
}

interface IStudentTaskDataForTeacher {
    student: IUser
    tasks: ITaskStudentDataForTeacher[]
}

export interface ITableDataForTeacher {
    lessons: ILessonDataForTeacher[]
    students: IStudentTaskDataForTeacher[]
}
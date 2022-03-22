import {IRequestConfig, request} from "../api/api";
import {ITasksResponse} from "../models/ITasksResponse";
import {ITask} from "../models/ITask";

export default class TaskService {
    static async getTasks(group_id: number | string,
                          course_id: number | string,
                          lesson_id: number | string): Promise<ITasksResponse> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/task/get_all`,
            auth: true,
            params: {group_id: group_id, course_id: course_id, lesson_id: lesson_id}
        }
        return request(requestConfig)
    }
    static async getTask(group_id: number | string,
                         course_id: number | string,
                         lesson_id: number | string,
                         task_id: number | string): Promise<ITask> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/task/get_one`,
            auth: true,
            params: {group_id: group_id, course_id: course_id, lesson_id: lesson_id, task_id: task_id}
        }
        return request(requestConfig)
    }
}
import {IRequestConfig, request} from "../api/api";
import {ISolution} from "../models/ISolution";
import {ISolutionCountResponse} from "../models/ISolutionCountResponse";

export default class SolutionService {
    static async getSolution(group_id: number | string,
                             course_id: number | string,
                             task_id: number | string,
                             solution_id: number | string): Promise<ISolution | null> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/solution/get_one`,
            auth: true,
            params: {
                group_id: group_id,
                course_id: course_id,
                task_id: task_id,
                solution_id: solution_id
            }
        }
        return request(requestConfig)
    }
    static async getBestSolution(group_id: number | string,
                                 course_id: number | string,
                                 task_id: number | string,
                                 user_id?:  number | string): Promise<ISolution | null> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/solution/get_best`,
            auth: true,
            params: {
                group_id,
                course_id,
                task_id,
                ...(user_id && {user_id: user_id})
            }
        }
        return request(requestConfig)
    }
    static async postSolution(group_id: number | string,
                              course_id: number | string,
                              lesson_id: number | string,
                              task_id: number | string,
                              files: FileList) {
        const formData = new FormData()
        formData.append("file", files[0], files[0].name)
        const requestConfig: IRequestConfig = {
            method: "post",
            url: `/solution/post_one`,
            auth: true,
            headers: {'Content-Type': 'multipart/form-data'},
            params: {group_id: group_id, course_id: course_id, lesson_id: lesson_id, task_id: task_id},
            data: formData
        }
        return await request(requestConfig)
    }
    static async getCountSolution(groupId: number | string,
                                  courseId: number | string,
                                  taskId: number | string): Promise<ISolutionCountResponse> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/solution/get_count`,
            auth: true,
            params: {
                group_id: groupId,
                course_id: courseId,
                task_id: taskId}
        }
        return await request(requestConfig)
    }
}
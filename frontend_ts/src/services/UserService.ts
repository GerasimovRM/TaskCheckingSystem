import {IRequestConfig, request} from "../api/api";
import {IStudentWithSolution} from "../models/IStudentWithSolution";
import {IUser} from "../models/IUser";

export default class UserService {
    static async getStudentsWithSolution(group_id: number | string,
                             course_id: number | string,
                             task_id: number | string): Promise<IStudentWithSolution[]> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/user/students_with_solution`,
            auth: true,
            params: {
                group_id: group_id,
                course_id: course_id,
                task_id: task_id
            }
        }
        return request(requestConfig)
    }
    static async getUserById(user_id: number | string): Promise<IUser> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/user/`,
            auth: true,
            params: {
                user_id: user_id
            }
        }
        return request(requestConfig)
    }

    static async getUserData() : Promise<IUser> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/user/get_data`,
            auth: true,
        }
        return request(requestConfig)
    }
}
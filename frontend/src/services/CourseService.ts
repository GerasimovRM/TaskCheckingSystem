import {IRequestConfig, request} from "../api/api";
import {ICoursesResponse} from "../models/ICoursesResponse";
import {ICourse} from "../models/ICourse";

export default class CourseService {
    static async getCourses(group_id: number | string): Promise<ICoursesResponse> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/course/get_all`,
            auth: true,
            params: {group_id: group_id}
        }
        return request(requestConfig)
    }
    static async getCourse(group_id: number | string,
                           course_id: number | string): Promise<ICourse> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/course/get_one`,
            auth: true,
            params: {group_id: group_id, course_id: course_id}
        }
        return request(requestConfig)
    }
    static async changeVisibility(group_id: number | string,
                                  course_id: number | string,
                                  lesson_id: number | string,
                                  is_hidden: boolean) {
        const requestConfig: IRequestConfig = {
            method: "post",
            url: `/course/change_visibility`,
            auth: true,
            params: {
                group_id: group_id,
                course_id: course_id,
                lesson_id: lesson_id,
                is_hidden: is_hidden
            }
        }
        return request(requestConfig)
    }
}
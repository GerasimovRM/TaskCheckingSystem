import {IRequestConfig, request} from "../api/api";
import {ILessonsResponse} from "../models/ILessonsResponse";
import {ILesson} from "../models/ILesson";

export default class LessonService {
    static async getLessons(group_id: number | string,
                            course_id: number | string): Promise<ILessonsResponse> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/lesson/get_all`,
            auth: true,
            params: {group_id: group_id, course_id: course_id}
        }
        return request(requestConfig)
    }
    static async getLesson(group_id: number | string,
                           course_id: number | string,
                           lesson_id: number | string): Promise<ILesson> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/lesson/get_one`,
            auth: true,
            params: {group_id: group_id, course_id: course_id, lesson_id: lesson_id}
        }
        return request(requestConfig)
    }
}
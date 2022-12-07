import {ICourseStat} from "../models/stat/ICourseStat";
import {IRequestConfig, request} from "../api/api";
import {ILessonStat} from "../models/stat/ILessonStat";
import {ITableDataForTeacher} from "../models/stat/ITableDataForTeacher";

export default class StatService {
    static async getCourseStatForStudent(group_id: number | string,
                                         course_id: number | string): Promise<ICourseStat> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/stat/get_course_stat_for_student`,
            auth: true,
            params: {group_id: group_id, course_id: course_id}
        }
        return request(requestConfig)
    }

    static async getLessonStat(group_id: number | string,
                               course_id: number | string,
                               lesson_id: number | string): Promise<ILessonStat> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/stat/get_lesson_stat_for_student`,
            auth: true,
            params: {group_id: group_id, course_id: course_id, lesson_id: lesson_id}
        }
        return request(requestConfig)
    }

    static async getTableForTeacher(group_id: number | string,
                                    course_id: number | string): Promise<ITableDataForTeacher> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/stat/get_table_for_teacher`,
            auth: true,
            params: {group_id: group_id, course_id: course_id}
        }
        return request(requestConfig)
    }
}
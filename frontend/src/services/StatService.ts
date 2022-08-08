import {ICourseStat} from "../models/stat/ICourseStat";
import {IRequestConfig, request} from "../api/api";

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
}
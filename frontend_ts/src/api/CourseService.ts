import {IRequestConfig, request} from "./api";
import {ICourse} from "../models/ICourse";
import {IGroup} from "../models/IGroup";


export default class CourseService {
    static async getGroups(): Promise<IGroup[]> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/page_data/groups`,
            auth: true
        }
        return await request(requestConfig)
    }
    static async getGroupCourses(group_id: number | string): Promise<ICourse[]> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/page_data/group/${group_id}/courses`,
            auth: true
        }
        return request(requestConfig)
    }
}
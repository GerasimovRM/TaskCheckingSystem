import {AxiosResponse} from "axios";
import {ILogin} from "../models/ILogin";
import {IRequestConfig, request} from "./api";
import {ICourses} from "../models/ICourses";
import {ICourse} from "../models/ICourse";
import {IGroup} from "../models/IGroup";


export default class CourseService {
    static async getGroups(): Promise<AxiosResponse<IGroup[]>> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/page_data/groups`,
            auth: true
        }
        const result = await request(requestConfig)
        return result
    }
    static async getGroupCourses(group_id: number | string): Promise<AxiosResponse<ICourse[]>> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/page_data/group/${group_id}/courses`,
            auth: true
        }
        const result = request(requestConfig)
        return result
    }
}
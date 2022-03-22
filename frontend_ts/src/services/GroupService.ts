import {IRequestConfig, request} from "../api/api";
import IGroupResponse from "../models/IGroupResponse";
import {IGroupRole} from "../models/IGroupRole";

export default class GroupService {
    static async getGroups(): Promise<IGroupResponse> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/group/get_all`,
            auth: true
        }
        return await request(requestConfig)
    }
    static async getGroupRole(groupId: number | string): Promise<IGroupRole> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/group/role`,
            auth: true,
            params: {group_id: groupId}
        }
        return await request(requestConfig)
    }
}
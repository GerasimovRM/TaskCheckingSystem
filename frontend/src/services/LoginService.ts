import {IRequestConfig, request} from "../api/api";
import {IAuthStateLogin} from "../store/reducers/auth/types";


export default class LoginService {
    static async loginRequest(vk_code: string): Promise<IAuthStateLogin> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: "/auth/login",
            params: {vk_code: vk_code},
            auth: false,
            withCredentials: true
        }
        return request(requestConfig)
    }
    static async logoutRequest(): Promise<any> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: "/auth/logout",
            auth: false,
            withCredentials: true
        }
        return request(requestConfig);
    }
}
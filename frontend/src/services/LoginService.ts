import {IRequestConfig, request} from "../api/api";
import {IAuthLogin} from "../models/IAuthLogin";
import ILoginData from "../models/ILoginData";


export default class LoginService {
    static async loginVkRequest(vk_code: string): Promise<IAuthLogin> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: "/auth/login",
            params: {vk_code: vk_code},
            auth: false,
            withCredentials: false
        }
        return request(requestConfig)
    }
    static async loginRequest(data: ILoginData): Promise<IAuthLogin> {
        const requestConfig: IRequestConfig = {
            method: "post",
            url: "/auth/login",
            data: {...data},
            auth: false,
            withCredentials: false
        }
        return request(requestConfig)
    }
    static async signUpRequest(data: ILoginData): Promise<IAuthLogin> {
        const requestConfig: IRequestConfig = {
            method: "post",
            url: "/auth/signup",
            data: {...data},
            auth: false,
            withCredentials: false
        }
        return request(requestConfig)
    }
    static async logoutRequest(): Promise<any> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: "/auth/logout",
            auth: false,
            withCredentials: false
        }
        return request(requestConfig);
    }
}
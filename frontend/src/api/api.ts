import axios, {AxiosRequestConfig, Method} from "axios";
import {store} from "../store";
import {AuthActionCreators} from "../store/reducers/auth/action-creators";
import {IAuthLogin} from "../models/IAuthLogin";
import UserService from "../services/UserService";


export interface IRequestConfig {
    method: Method,
    url: string,
    params?: any,
    data?: any,
    headers?: any,
    auth?: boolean,
    withCredentials?: boolean
}

export const request = async (requestConfig: IRequestConfig): Promise<any> => {
    const axiosRequestConfig: AxiosRequestConfig = {
        method:  requestConfig.method,
        url: `${baseApi}${requestConfig.url}`,
        params: requestConfig.params,
        data: requestConfig.data,
        headers: requestConfig.headers? requestConfig.headers : {},
        withCredentials: requestConfig.withCredentials
    }
    if (requestConfig.auth) {
        const token = localStorage.getItem("access_token");
        if (token) {
            axiosRequestConfig.headers = {...axiosRequestConfig.headers, Authorization: `Bearer ${token}`}
        }
    }
    console.log(axiosRequestConfig);
    return await axios(axiosRequestConfig)
        .then(response => response.data)
        .catch(async (error) => {
            // если токен протух, рефрешим, делаем запрос заного, в случае неуспеха - разлогинимся
            if (error.response.status === 401) {
                const axiosRefreshTokenRequestConfig: AxiosRequestConfig = {
                    method: "get",
                    url: `${baseApi}/auth/refresh_token`,
                    withCredentials: true
                }
                return await axios(axiosRefreshTokenRequestConfig)
                    .then(async (refresh_token_response) => {
                        const login_data: IAuthLogin = refresh_token_response.data
                        store.dispatch(AuthActionCreators.setLogin(login_data))
                        axiosRequestConfig.headers = {...axiosRequestConfig.headers, Authorization: `Bearer ${login_data.access_token}`}
                        return await axios(axiosRequestConfig).then(response => response.data)
                    })
                    .catch(async () => {
                        // store.dispatch(AuthActionCreators.logout())
                    })
            }
        });
}

export const baseApi = process.env.NODE_ENV === "production" ? process.env.REACT_APP_PROD_API_URL : process.env.REACT_APP_DEV_API_URL
export const baseURL = process.env.NODE_ENV === "production" ? process.env.REACT_APP_PROD_SITE_URL : process.env.REACT_APP_DEV_SITE_URL
export const vkClientId = process.env.NODE_ENV === "production" ? process.env.REACT_APP_PROD_VK_CLIENT_ID : process.env.REACT_APP_DEV_VK_CLIENT_ID
console.log(baseURL)

import axios, {AxiosRequestConfig, Method} from "axios";
import {store} from "../store";
import {AuthActionCreators} from "../store/reducers/auth/action-creators";
import {IAuthLogin} from "../models/IAuthLogin";
import {decodeLocal} from "./Common";


export interface IRequestConfig {
    method: Method,
    url: string,
    params?: any,
    data?: any,
    headers?: any,
    auth?: boolean,
    withCredentials?: boolean,
}

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config
        if (error.response.status === 401) {
            originalRequest._retry = true
            const axiosRefreshTokenRequestConfig: AxiosRequestConfig = {
                method: "get",
                url: `${baseApi}/auth/refresh_token`,
                withCredentials: true
            }
            return await axios(axiosRefreshTokenRequestConfig)
                .then(async (refresh_token_response) => {
                    const login_data: IAuthLogin = refresh_token_response.data
                    console.log(login_data)
                    store.dispatch(AuthActionCreators.setLogin(login_data))
                    localStorage.setItem("access_token", decodeLocal(login_data.access_token))
                    originalRequest.headers = {...originalRequest.headers, Authorization: `Bearer ${login_data.access_token}`}
                    return axios(error.config)
                   })
                .catch(async () => {
                    await AuthActionCreators.logout()(store.dispatch)
                })
        }
        return Promise.reject(error);
    }
);


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
        .then(response => response.data);
}

export const baseApi = process.env.NODE_ENV === "production" ? process.env.REACT_APP_PROD_API_URL : process.env.REACT_APP_DEV_API_URL
export const baseURL = process.env.NODE_ENV === "production" ? process.env.REACT_APP_PROD_SITE_URL : process.env.REACT_APP_DEV_SITE_URL
export const vkClientId = process.env.NODE_ENV === "production" ? process.env.REACT_APP_PROD_VK_CLIENT_ID : process.env.REACT_APP_DEV_VK_CLIENT_ID
console.log(baseURL)

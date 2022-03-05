import axios, {AxiosRequestConfig, AxiosResponse, Method} from "axios";

export interface IRequestConfig {
    method: Method,
    url: string,
    params?: any,
    data?: any,
    headers?: any,
    auth?: boolean,
    withCredentials?: boolean
}

export const request = async (requestConfig: IRequestConfig): Promise<AxiosResponse> => {
    const axiosRequestConfig: AxiosRequestConfig = {
        method:  requestConfig.method,
        url: `${baseApi}${requestConfig.url}`,
        params: requestConfig.params,
        data: requestConfig.data,
        headers: requestConfig.headers? requestConfig.headers : {},
        withCredentials: requestConfig.withCredentials
    }
    if (requestConfig.auth) {
        const token = localStorage.getItem('access_token');
        if (token) {
            axiosRequestConfig.headers = {...axiosRequestConfig.headers, Authorization: `Bearer ${token}`}
        }
    }
    const response = await axios(axiosRequestConfig);
    if (response.status === 401) {
        const axiosRefreshTokenRequestConfig: AxiosRequestConfig = {
            method:  "get",
            url: `${baseApi}/auth/refresh_token`,
            withCredentials: true
        }
        const refresh_token_response = await axios(axiosRefreshTokenRequestConfig);
        if (refresh_token_response.status === 200) {
            localStorage.setItem("access_token", refresh_token_response.data.access_token);
            await axios(axiosRequestConfig);
        }
        return refresh_token_response;
    }
    return response;
};

export const baseApi = 'http://localhost:5000';
export const baseURL = 'http://localhost:3000';

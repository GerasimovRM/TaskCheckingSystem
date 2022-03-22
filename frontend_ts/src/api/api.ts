import axios, {AxiosRequestConfig, Method} from "axios";

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
        const token = localStorage.getItem('access_token');
        if (token) {
            axiosRequestConfig.headers = {...axiosRequestConfig.headers, Authorization: `Bearer ${token}`}
        }
    }
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
                        const token = refresh_token_response.data.access_token
                        localStorage.setItem("access_token", token);
                        axiosRequestConfig.headers = {...axiosRequestConfig.headers, Authorization: `Bearer ${token}`}
                        return await axios(axiosRequestConfig).then(response => response.data)
                    })
                    .catch(async () => {
                        // store.dispatch(AuthActionCreators.logout())
                    })
            }
        });
}

export const baseApi = process.env.REACT_APP_API_URL
export const baseURL = process.env.REACT_APP_SITE_URL
    
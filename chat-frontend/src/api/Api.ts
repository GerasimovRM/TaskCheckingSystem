import IFetchConfig from "../models/IFetchConfig";

export default async (FetchConfig: IFetchConfig): Promise<any> => {
    const token = localStorage.getItem('access_token');
    const url = host + FetchConfig.url + (FetchConfig.params ? `?${new URLSearchParams(FetchConfig.params)}` : '');
    const req = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        method: FetchConfig.method,
        body: FetchConfig.body,
    });
    console.log(req);
    return req.json();
}

const host = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_API_URL : process.env.REACT_APP_DEV_API_URL;
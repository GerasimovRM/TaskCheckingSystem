export default interface IFetchConfig {
    url: string,
    method: 'GET' | 'POST',
    body?: BodyInit,
    params?: any
}
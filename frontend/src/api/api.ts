const devApiUrl = 'http://localhost:5000/api';
const prodApiUrl = '/api';

export const apiUrl =
  process.env.NODE_ENV === 'production' ? prodApiUrl : devApiUrl;

interface IRequest {
  auth?: boolean;
  headers?: Record<string, string>;
  body?: Record<any, any>;
}

interface IResponse<T = Record<any, any>> {
  res: Response;
  json: T;
}

type RequestFunction = <T>(
  method: string,
  path: string,
  requestParams: IRequest,
) => Promise<IResponse<T>>;

export const request: RequestFunction = async <T = Record<any, any>>(
  method: string,
  path: string,
  requestParams: IRequest = {},
): Promise<IResponse<T>> => {
  const httpMethod = method.toUpperCase();
  const params = {
    ...requestParams,
  };

  if (!params.headers) {
    params.headers = {};
  }

  if (params.auth || params.auth === undefined) {
    params.headers.Authorization = `Bearer ${localStorage.getItem(
      'access_token',
    )}`;
  }

  const init: RequestInit = {
    mode: 'cors',
    method: httpMethod,
    headers: params.headers,
  };

  if (httpMethod !== 'GET' && httpMethod !== 'HEAD') {
    params.headers['Content-Type'] = 'application/json;charset=utf-8';
    if (params.body !== undefined) {
      init.body = JSON.stringify(params.body);
    }
  }

  const res = await fetch(`${apiUrl}${path}`);

  return {
    res,
    json: await res.json(),
  };
};

export const bindRequest = (
  prefix: string,
  preparedParams: IRequest,
  requestFunction: RequestFunction,
): RequestFunction => {
  return (method: string, path: string, requestParams: IRequest) =>
    requestFunction(method, prefix + path, {
      ...preparedParams,
      ...requestParams,
    });
};

type RequestWithoutBody = <T>(
  path: string,
  params: IRequest,
) => Promise<IResponse<T>>;
type RequestWithBody = <T>(
  path: string,
  params: IRequest,
) => Promise<IResponse<T>>;

interface IRequestMethods {
  get: RequestWithoutBody;
  post: RequestWithBody;
  put: RequestWithBody;
  delete: RequestWithoutBody;
  request: RequestFunction;
}

export const bindMethods = (
  requestFunction: RequestFunction,
): IRequestMethods => {
  const bodyRequest = <T>(
    method: string,
    path: string,
    body: any,
    params: IRequest = {},
  ) => requestFunction<T>(method, path, { ...params, body });
  return {
    get: <T>(path: string, params: IRequest = {}) =>
      requestFunction<T>('get', path, params),
    post: <T>(path: string, body: any, params: IRequest = {}) =>
      bodyRequest<T>('post', path, body, params),
    put: <T>(path: string, body: any, params: IRequest = {}) =>
      bodyRequest<T>('put', path, body, params),
    delete: <T>(path: string, params: IRequest = {}) =>
      requestFunction<T>('delete', path, params),
    request: requestFunction,
  };
};

export const createApi = (apiPath: string, preparedParams: IRequest = {}) =>
  bindMethods(bindRequest(apiPath, preparedParams, request));

export default request;

const devApiUrl = 'http://localhost:5000/api';
const prodApiUrl = '/api';

export const apiUrl =
  process.env.NODE_ENV === 'production' ? prodApiUrl : devApiUrl;

interface IRequest {
  auth?: boolean;
  headers?: Record<string, string>;
  body?: Record<any, any>;
}

interface IResponse {
  res: Response;
  json: Record<any, any>;
}

export const request = async (
  method: string,
  path: string,
  requestParams: IRequest = {},
): Promise<IResponse> => {
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

export const request = async (method, url, params) => {
  const requestParams = {
    headers: {},
  };
  if (params.headers) {
    requestParams.headers = {
      ...requestParams.headers,
      ...params.headers,
    };
  }

  if (params.auth === undefined) {
    params.auth = true;
  }

  if (params.auth === true) {
    const token = localStorage.getItem('access_token');
    if (token) {
      params.headers.Authorization = `Bearer ${token}`;
    }
  }

  if (typeof params.body === 'object' && params.body !== null) {
    requestParams.body = JSON.stringify(params.body);
    requestParams.headers['Content-Type'] = 'application/json';
  }

  const req = await fetch(url, {
    method: method.toUpperCase(),
    ...requestParams,
  });
  return {
    req,
    json: await req.json(),
  };
};

export const requestBind = (apiPath, preparedParam) => {
  return (method, path, params) => {
    return request(method, apiPath + path, {
      ...preparedParam,
      ...params,
    });
  };
};

export const methodBind = (requestFunction) => {
  const bodyRequest = (method, path, body, params) => {
    return requestFunction(method, path, { ...params, body });
  };
  return {
    get: (path, params) => requestFunction('get', path, params),
    post: (path, body, params) => bodyRequest('post', path, body, params),
    put: (path, body, params) => bodyRequest('put', path, body, params),
    delete: (path, params) => requestFunction('delete', path, params),
    request: requestFunction,
  };
};

export const createApi = (apiPath, preparedParam) => {
  return methodBind(requestBind(apiPath, preparedParam));
};

export const baseApi = 'http://localhost:5000';

const baseRequest = async (method, url, params) => {
  const requestParams = {
    headers: {},
    credentials: 'include',
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
      requestParams.headers.Authorization = `Bearer ${token}`;
    }
  }
  else {
    requestParams.credentials = 'include';
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

export const request = async (method, url, params) => {
  const resp = await baseRequest(method, url, params);
  if (resp.req.status === 401 && resp.json.detail === "Could not validate credentials") {
    const refresh_resp = await baseRequest(
      'get',
      `${baseApi}/auth/refresh_token`,
      { auth: false },
    );
    if (refresh_resp.req.status === 200) {
      localStorage.setItem('access_token', refresh_resp.json.access_token);
      return await baseRequest(method, url, params);
    }
    return refresh_resp;
  }
  return resp;
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

export const baseApi = 'http://82.179.126.255:5000';
export const baseURL = 'http://82.179.126.255:3000';

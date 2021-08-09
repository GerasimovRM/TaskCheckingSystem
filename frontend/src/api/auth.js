import { encode } from 'querystring';
import { createApi, baseApi } from './api';

const { get } = createApi(`${baseApi}/auth`);

export const login = async (code, password) => {
  const query = {
    vk_code: code,
  };
  if (password !== undefined) {
    query.password = password;
  }
  const resp = await get(`/login?${encode(query)}`, {
    auth: false,
  });

  if (resp.req.status === 200) {
    localStorage.setItem('access_token', resp.json.access_token);
    document.cookie = `refresh_token=${resp.json.refresh_token}`;
    return {
      status: true,
    };
  }
  return {
    status: false,
    detail: resp.json.detail,
  };
};

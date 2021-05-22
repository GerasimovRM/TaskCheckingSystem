import { request } from './api';

const getUserData = () => {
  return request('get', '/user/get_user_data/');
};

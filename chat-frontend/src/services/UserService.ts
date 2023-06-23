import Api from "../api/Api";
import IFetchConfig from "../models/IFetchConfig";
import { IUser } from "../models/IUser";

class UserService {
    static async fetchUserData(user_id: number | string): Promise<IUser> {
        const fetchConfig: IFetchConfig = {
            method: 'GET',
            url: '/user',
            params: {user_id}
        }
        return Api(fetchConfig);
    }
}

export default UserService
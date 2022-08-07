import {IUser} from "./IUser";

export interface IAuthLogin {
    access_token: string;
    user: IUser;
}
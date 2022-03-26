import {IUser} from "../../../models/IUser";
import exp from "constants";

export interface AuthState {
    access_token?: string | null;
    user?: IUser;
    isAuth: boolean;
    isLoading: boolean;
    error?: string;
}

export interface IAuthStateLogin {
    access_token: string;
    user: IUser;
}

export enum AuthActionEnum {
    SET_AUTH = "SET_AUTH",
    SET_AUTH_ERROR = "SET_AUTH_ERROR",
    SET_AUTH_IS_LOADING = "SET_AUTH_IS_LOADING",
    LOGIN = "LOGIN",
    SET_AUTH_USER = "SET_AUTH_USER"
}

export interface SetUserAuthAction {
    type: AuthActionEnum.SET_AUTH_USER;
    payload: IUser;
}

export interface LoginAuthAction {
    type: AuthActionEnum.LOGIN;
    payload: IAuthStateLogin;
}

export interface SetAuthAction {
    type: AuthActionEnum.SET_AUTH;
    payload: boolean;
}
export interface SetErrorAuthAction {
    type: AuthActionEnum.SET_AUTH_ERROR;
    payload: string;
}
export interface SetIsLoadingAuthAction {
    type: AuthActionEnum.SET_AUTH_IS_LOADING;
    payload: boolean;
}

export type AuthAction =
    SetAuthAction |
    SetErrorAuthAction |
    SetIsLoadingAuthAction |
    LoginAuthAction |
    SetUserAuthAction
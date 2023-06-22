import {IUser} from "../../../models/IUser";
import {IAuthLogin} from "../../../models/IAuthLogin";

export interface AuthState {
    user?: IUser;
    isAuth: boolean;
    isLoading: boolean;
    error?: string;
}

export enum AuthActionEnum {
    SET_AUTH = "SET_AUTH",
    SET_AUTH_ERROR = "SET_AUTH_ERROR",
    SET_AUTH_IS_LOADING = "SET_AUTH_IS_LOADING",
    SET_LOGIN = "SET_LOGIN",
    SET_AUTH_USER = "SET_AUTH_USER",
    SET_RESET_STATE = "SET_RESET_STATE"
}

export interface ResetState {
    type: AuthActionEnum.SET_RESET_STATE
}

export interface SetUserAuthAction {
    type: AuthActionEnum.SET_AUTH_USER;
    payload?: IUser;
}

export interface SetLoginAuthAction {
    type: AuthActionEnum.SET_LOGIN;
    payload: IAuthLogin;
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
    SetLoginAuthAction |
    SetUserAuthAction |
    ResetState
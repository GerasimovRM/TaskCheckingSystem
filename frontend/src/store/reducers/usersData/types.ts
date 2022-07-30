import {IUser} from "../../../models/IUser";

export interface UsersDataState {
    users: IUser[];
    usersIsLoading: boolean;
    usersError?: string;
}

export enum UsersDataActionEnum {
    CLEAR_USERS_DATA = "CLEAR_USERS_DATA",
    SET_USERS_DATA = "SET_USERS_DATA",
    ADD_USER_DATA = "ADD_USERS_DATA",
    SET_ERROR_USERS_DATA = "SET_ERROR_USERS_DATA",
    SET_USERS_DATA_IS_LOADING = "SET_SELECTED_USER_IS_LOADING",
}

export interface ClearUsersDataAction {
    type: UsersDataActionEnum.CLEAR_USERS_DATA
}

export interface SetUsersDataAction {
    type: UsersDataActionEnum.SET_USERS_DATA;
    payload: IUser[];
}

export interface AddUserDataAction {
    type: UsersDataActionEnum.ADD_USER_DATA;
    payload: IUser;
}

export interface SetErrorUsersDataAction {
    type: UsersDataActionEnum.SET_ERROR_USERS_DATA;
    payload: string;
}

export interface SetIsLoadingUsersDataAction {
    type: UsersDataActionEnum.SET_USERS_DATA_IS_LOADING;
    payload: boolean;
}

export type UsersDataAction = ClearUsersDataAction |
    SetErrorUsersDataAction |
    SetUsersDataAction |
    AddUserDataAction |
    SetIsLoadingUsersDataAction
import {IUser} from "../../../models/IUser";

export interface SelectedUserState {
    selectedUser?: IUser;
    isLoading: boolean;
    error?: string;
}

export enum SelectedUserActionEnum {
    CLEAR_SELECTED_USER = "CLEAR_SELECTED_USER",
    SET_SELECTED_USER = "SET_SELECTED_USER",
    SET_SELECTED_ERROR = "SET_SELECTED_ERROR",
    SET_SELECTED_USER_IS_LOADING = "SET_SELECTED_USER_IS_LOADING",
}

export interface ClearSelectedUserAction {
    type: SelectedUserActionEnum.CLEAR_SELECTED_USER
}

export interface SetSelectedUserAction {
    type: SelectedUserActionEnum.SET_SELECTED_USER;
    payload: IUser;
}

export interface SetErrorSelectedUserAction {
    type: SelectedUserActionEnum.SET_SELECTED_ERROR;
    payload: string;
}

export interface SetIsLoadingSelectedUserAction {
    type: SelectedUserActionEnum.SET_SELECTED_USER_IS_LOADING;
    payload: boolean;
}

export type SelectedUserAction = SetSelectedUserAction | SetErrorSelectedUserAction | SetIsLoadingSelectedUserAction | ClearSelectedUserAction
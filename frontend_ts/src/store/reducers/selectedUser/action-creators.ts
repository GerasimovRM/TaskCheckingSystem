import {
    ClearSelectedUserAction,
    SelectedUserActionEnum,
    SetErrorSelectedUserAction,
    SetIsLoadingSelectedUserAction,
    SetSelectedUserAction
} from "./types";
import {IUser} from "../../../models/IUser";

export const SelectedUserActionCreators = {
    clearSelectedUser: (): ClearSelectedUserAction => ({type: SelectedUserActionEnum.CLEAR_SELECTED_USER}),
    setSelectedUser: (user: IUser): SetSelectedUserAction => ({type: SelectedUserActionEnum.SET_SELECTED_USER, payload: user}),
    setIsLoadingSelectedUser: (payload: boolean): SetIsLoadingSelectedUserAction => ({type: SelectedUserActionEnum.SET_SELECTED_USER_IS_LOADING, payload}),
    setErrorSelectedUser: (payload: string): SetErrorSelectedUserAction => ({type: SelectedUserActionEnum.SET_SELECTED_ERROR, payload}),
}
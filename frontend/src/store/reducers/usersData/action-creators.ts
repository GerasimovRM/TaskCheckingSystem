import {IUser} from "../../../models/IUser";
import {
    AddUserDataAction,
    ClearUsersDataAction,
    SetErrorUsersDataAction,
    SetIsLoadingUsersDataAction,
    SetUsersDataAction,
    UsersDataActionEnum
} from "./types";
import {AppDispatch} from "../../index";
import UserService from "../../../services/UserService";

export const UsersDataActionCreators = {
    clearUsersData: (): ClearUsersDataAction => ({type: UsersDataActionEnum.CLEAR_USERS_DATA}),
    setUsersData: (payload: IUser[]): SetUsersDataAction => ({type: UsersDataActionEnum.SET_USERS_DATA, payload}),
    setIsLoadingUsersData: (payload: boolean): SetIsLoadingUsersDataAction => ({type: UsersDataActionEnum.SET_USERS_DATA_IS_LOADING, payload}),
    setErrorUsersData: (payload: string): SetErrorUsersDataAction => ({type: UsersDataActionEnum.SET_ERROR_USERS_DATA, payload}),
    addUserData: (payload: IUser): AddUserDataAction => ({type: UsersDataActionEnum.ADD_USER_DATA, payload}),
    fetchUserData: (user_id: number | string) => async (dispatch: AppDispatch) => {
        console.log(567)
        dispatch(UsersDataActionCreators.setIsLoadingUsersData(true))
        const response = await UserService.getUserById(user_id)
        if (response) {
            dispatch(UsersDataActionCreators.addUserData(response))
        }
        dispatch(UsersDataActionCreators.setIsLoadingUsersData(false))
    }
}
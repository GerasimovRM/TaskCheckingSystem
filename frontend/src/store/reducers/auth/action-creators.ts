import {
    AuthActionEnum,
    IAuthStateLogin,
    SetLoginAuthAction,
    SetAuthAction, SetErrorAuthAction, SetIsLoadingAuthAction,
    SetUserAuthAction
} from "./types";
import {AppDispatch} from "../../index";
import LoginService from "../../../services/LoginService";
import {decodeLocal} from "../../../api/Common";
import {IUser} from "../../../models/IUser";
import UserService from "../../../services/UserService";

export const AuthActionCreators = {
    setIsAuth: (auth: boolean): SetAuthAction => ({type: AuthActionEnum.SET_AUTH, payload: auth}),
    setIsLoadingAuth: (payload: boolean): SetIsLoadingAuthAction => ({type: AuthActionEnum.SET_AUTH_IS_LOADING, payload}),
    setErrorAuth: (payload: string): SetErrorAuthAction => ({type: AuthActionEnum.SET_AUTH_ERROR, payload}),
    setLogin: (payload: IAuthStateLogin): SetLoginAuthAction => ({type: AuthActionEnum.SET_LOGIN, payload}),
    setUser: (payload?: IUser): SetUserAuthAction => ({type: AuthActionEnum.SET_AUTH_USER, payload}),
    loadUser: () => async (dispatch: AppDispatch) => {
        UserService.getUserData().then((user) =>
            dispatch(AuthActionCreators.setUser(user)))
    },
    login: (vk_code: string) => async (dispatch: AppDispatch) => {
        try {
            dispatch(AuthActionCreators.setIsLoadingAuth(true))
            const login_data = await LoginService.loginRequest(vk_code)
            localStorage.setItem("access_token", decodeLocal(login_data.access_token))
            dispatch(AuthActionCreators.setLogin(login_data))

        } catch (e) {
            dispatch(AuthActionCreators.setIsLoadingAuth(false))
            dispatch(AuthActionCreators.setErrorAuth("Ошибка при логине"))
        }
    },
    logout: () => async (dispatch: AppDispatch) => {
        await LoginService.logoutRequest()
        localStorage.removeItem("access_token")
        dispatch(AuthActionCreators.setIsAuth(false))
        // return {type: AuthActionEnum.SET_AUTH, payload: false}
    }
}
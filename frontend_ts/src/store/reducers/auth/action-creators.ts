import {AuthActionEnum, SetAuthAction, SetErrorAction, SetIsLoadingAction} from "./types";
import {AppDispatch} from "../../index";
import LoginService from "../../../api/LoginService";

export const AuthActionCreators = {
    setIsAuth: (auth: boolean): SetAuthAction => ({type: AuthActionEnum.SET_AUTH, payload: auth}),
    setIsLoading: (payload: boolean): SetIsLoadingAction => ({type: AuthActionEnum.SET_IS_LOADING, payload}),
    setError: (payload: string): SetErrorAction => ({type: AuthActionEnum.SET_ERROR, payload}),
    login: (vk_code: string) => async (dispatch: AppDispatch) => {
        try {
            dispatch(AuthActionCreators.setIsLoading(true))
            const response = await LoginService.loginRequest(vk_code)
            localStorage.setItem('access_token', response.access_token)
            localStorage.setItem('avatar_url', response.avatar_url)
            dispatch(AuthActionCreators.setIsLoading(false))
            dispatch(AuthActionCreators.setIsAuth(true))
            return {type: AuthActionEnum.SET_AUTH, payload: true}
        } catch (e) {
            dispatch(AuthActionCreators.setIsLoading(false))
            dispatch(AuthActionCreators.setError("Ошибка при логине"))
            return {type: AuthActionEnum.SET_ERROR, payload: "Ошибка при логине"}
        }
    },
    logout: () => async (dispatch: AppDispatch) => {
        await LoginService.logoutRequest()
        dispatch(AuthActionCreators.setIsAuth(false))
        localStorage.removeItem("access_token")
        localStorage.removeItem("avatar_url")
        // return {type: AuthActionEnum.SET_AUTH, payload: false}
    }
}
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
            localStorage.setItem('access_token', response.data.access_token);
            dispatch(AuthActionCreators.setIsLoading(false))
            dispatch(AuthActionCreators.setIsAuth(true))
        } catch (e) {
            dispatch(AuthActionCreators.setIsLoading(false))
            dispatch(AuthActionCreators.setError("Ошибка при логине"))
        }
    },
    logout: () => async (dispatch: AppDispatch) => {
        dispatch(AuthActionCreators.setIsAuth(false))
        localStorage.removeItem("access_token")
    }
}
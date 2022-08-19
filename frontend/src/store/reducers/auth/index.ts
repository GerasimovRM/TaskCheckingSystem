import {AuthAction, AuthActionEnum, AuthState} from "./types";
import {encodeLocal} from "../../../api/Common";

const initialState: AuthState = {
    isAuth: !!localStorage.getItem("access_token"),
    isLoading: false,
}

export default function authReducer(state: AuthState = initialState, action: AuthAction): AuthState {
    switch (action.type) {
        case AuthActionEnum.SET_AUTH:
            return {...state, isAuth: action.payload, isLoading: false}
        case AuthActionEnum.SET_AUTH_ERROR:
            return {...state, error: action.payload, isLoading: false}
        case AuthActionEnum.SET_AUTH_IS_LOADING:
            return {...state, isLoading: action.payload}
        case AuthActionEnum.SET_LOGIN:
            return {...state, ...action.payload, isLoading: false, isAuth: true, error: undefined}
        case AuthActionEnum.SET_AUTH_USER:
            return {...state, user: action.payload, isLoading: false, error: undefined, isAuth: true}
        default:
            return state;
    }
}
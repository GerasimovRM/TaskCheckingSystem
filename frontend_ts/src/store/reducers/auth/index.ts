import {AuthAction, AuthActionEnum, AuthState} from "./types";

const initialState: AuthState = {
    isAuth: !!localStorage.getItem("access_token"),
    isLoading: false,
    error: ''
}

export default function authReducer(state: AuthState = initialState, action: AuthAction): AuthState {
    switch (action.type) {
        case AuthActionEnum.SET_AUTH:
            return {...state, isAuth: action.payload, isLoading: false}
        case AuthActionEnum.SET_ERROR:
            return {...state, error: action.payload, isLoading: false}
        case AuthActionEnum.SET_IS_LOADING:
            return {...state, isLoading: action.payload}
        default:
            return state;
    }
}
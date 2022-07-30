import {SelectedUserState, SelectedUserActionEnum, SelectedUserAction} from "./types";

const initialState: SelectedUserState = {
    isLoading: false
}

export default function selectedUserReducer(state: SelectedUserState = initialState, action: SelectedUserAction): SelectedUserState {
    switch (action.type) {
        case SelectedUserActionEnum.CLEAR_SELECTED_USER:
            return {...initialState}
        case SelectedUserActionEnum.SET_SELECTED_USER:
            return {...state, selectedUser: action.payload, isLoading: false}
        case SelectedUserActionEnum.SET_SELECTED_ERROR:
            return {...state, error: action.payload, isLoading: false}
        case SelectedUserActionEnum.SET_SELECTED_USER_IS_LOADING:
            return {...state, isLoading: action.payload}
        default:
            return state;
    }
}
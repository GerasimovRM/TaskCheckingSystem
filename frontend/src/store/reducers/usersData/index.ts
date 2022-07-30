import {UsersDataAction, UsersDataActionEnum, UsersDataState} from "./types";
import {IUser} from "../../../models/IUser";

const initialState: UsersDataState = {
    users: [],
    usersIsLoading: false
}

export default function selectedUserReducer(state: UsersDataState = initialState, action: UsersDataAction): UsersDataState {
    switch (action.type) {
        case UsersDataActionEnum.CLEAR_USERS_DATA:
            return {...initialState}
        case UsersDataActionEnum.SET_USERS_DATA:
            return {...state, users: action.payload, usersIsLoading: false}
        case UsersDataActionEnum.SET_ERROR_USERS_DATA:
            return {...state, usersError: action.payload, usersIsLoading: false}
        case UsersDataActionEnum.SET_USERS_DATA_IS_LOADING:
            return {...state, usersIsLoading: action.payload}
        case UsersDataActionEnum.ADD_USER_DATA:
            let users: IUser[] = [...state.users, action.payload]
            let users2 = users.filter((item, pos) => {
                return users.indexOf(item) === pos
            })
            return {...state, users: users2}
        default:
            return state;
    }
}
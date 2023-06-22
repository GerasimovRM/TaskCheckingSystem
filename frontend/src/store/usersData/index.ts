import {UsersDataState} from "./types";
import {IUser} from "../../models/IUser";
import UserService from "../../services/UserService";
import { makeAutoObservable, runInAction } from "mobx";

export default class UsersDataStore implements UsersDataState {
    users: IUser[] = [];
    usersIsLoading: boolean = false;
    usersError?: string;

    constructor() {
        makeAutoObservable(this);
    }

    clearUsersData() {
        this.users = [];
        this.usersIsLoading = false;
        this.usersError = undefined;
    }
    setUserData(users: IUser[]) {
        this.users = users;
        this.usersIsLoading = false;
    }
    setErrorUsersData(erorr: string) {
        this.usersError = erorr;
        this.usersIsLoading = false;
    }
    setUsersDataIsLoading(state: boolean) {
        this.usersIsLoading = state;
    }
    addUserData(user: IUser) {
        let users: IUser[] = [...this.users, user];
        let users2 = users.filter((item, pos) => {
            return users.indexOf(item) === pos
        });
        this.users = users2;
    }
    async fetchUserData (user_id: number | string) {
        runInAction(() => {
            this.setUsersDataIsLoading(true);
        });
        const response = await UserService.getUserById(user_id)
        runInAction(() => {
            if (response) {
                this.addUserData(response);
            }
            this.setUsersDataIsLoading(false);
        });
    }
}
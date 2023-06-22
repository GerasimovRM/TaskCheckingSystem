import { makeAutoObservable } from "mobx";
import { IUser } from "../../models/IUser";
import {SelectedUserState} from "./types";

export default class SelectedUserStore implements SelectedUserState {
    isLoading: boolean = false;
    selectedUser?: IUser;
    error?: string;

    constructor() {
        makeAutoObservable(this);
    }

    clearSelectedUser() {
        this.isLoading = false;
        this.selectedUser = undefined;
        this.error = undefined;
    }
    setSelectedUser(user: IUser) {
        this.selectedUser = user;
    }
    setSelectedError(error: string) {
        this.error = error;
    }
    setSelectedUserIsLoading(state: boolean) {
        this.isLoading = state;
    }
}
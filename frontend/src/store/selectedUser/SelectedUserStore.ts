import { makeAutoObservable } from "mobx";
import { IUser } from "../../models/IUser";
import {SelectedUserState} from "./types";

export default class SelectedUserStore implements SelectedUserState {
    isLoading: boolean = false;
    selectedUser?: IUser = undefined;
    error?: string = undefined;

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    clearSelectedUser() {
        this.isLoading = false;
        this.selectedUser = undefined;
        this.error = undefined;
    }
    setSelectedUser(user: IUser) {
        //console.log(user)
        this.selectedUser = user;
    }
    setSelectedError(error: string) {
        this.error = error;
    }
    setSelectedUserIsLoading(state: boolean) {
        this.isLoading = state;
    }
}
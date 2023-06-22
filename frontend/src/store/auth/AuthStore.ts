import { makeAutoObservable, runInAction } from "mobx";
import { decodeLocal } from "../../api/Common";
import ILoginData from "../../models/ILoginData";
import { IUser } from "../../models/IUser";
import LoginService from "../../services/LoginService";
import UserService from "../../services/UserService";
import { AuthState } from "./types";

export default class AuthStore implements AuthState {
    user?: IUser;
    isAuth = false;
    isLoading = false;
    error?: string;

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    setIsAuth(state: boolean) {
        this.isAuth = state;
        this.isLoading = false;
    }
    setAuthError(error: string) {
        this.error = error;
        this.isLoading = false;
    }
    setAuthIsLoading(state: boolean) {
        this.isLoading = state;
    }
    setLogin(user: IUser) {
        this.user = user;
        this.isLoading = false;
    }
    setAuthUser(user: IUser) {
        this.user = user;
        this.isLoading = false;
        this.error = undefined;
        this.isAuth = true;
    }
    resetState() {
        this.user = undefined;
        this.isAuth = false;
        this.isLoading = false;
        this.error = undefined;
    }
    async loadUser() {
        runInAction(() => {
            UserService.getUserData().then(user => {
                this.setAuthUser(user);
            });
        });
    }
    async vkLogin(vk_code: string) {
        try {
            runInAction(() => {
                this.isLoading = true
            });
            const login_data = await LoginService.loginVkRequest(vk_code);
            localStorage.setItem("access_token", decodeLocal(login_data.access_token));
            runInAction(() => {
                this.setLogin(login_data.user);
                this.isAuth = true;
            });

        } catch (e) {
            runInAction(() => {
                this.isLoading = false;
                this.error = "Ошибка при логине";
            });
        }
    }
    async login(data: ILoginData): Promise<Boolean> {
        try {
            runInAction(() => {
                this.isLoading = true;
            });
            const login_data = await LoginService.loginRequest(data);
            localStorage.setItem("access_token", decodeLocal(login_data.access_token));
            runInAction(() => {
                this.setLogin(login_data.user);
                this.isAuth = true;
            });
            return true;
        } catch (e) {
            runInAction(() => {
                this.isLoading = false;
                this.error = "Ошибка при логине";
            });
            return false;
        }
    }
    async signUp(data: ILoginData): Promise<Boolean> {
        try {
            runInAction(() => {
                this.isLoading = true
            });
            const login_data = await LoginService.signUpRequest(data);
            localStorage.setItem("access_token", decodeLocal(login_data.access_token));
            runInAction(() => {
                this.setLogin(login_data.user);
                this.isAuth = true;
            });
            return true;
        } catch (e) {
            runInAction(() => {
                this.isLoading = false;
                this.error = "Ошибка при регистрации";
            });
            return false;
        }
    }
    async logout() {
        await LoginService.logoutRequest()
        localStorage.removeItem("access_token")
        this.resetState();
    }
}
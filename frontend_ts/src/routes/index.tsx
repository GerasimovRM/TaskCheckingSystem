import {ReactElement} from "react";
import Home from "../pages/Home";
import NoAuth from "../pages/NoAuth";
import {SettingsPage} from "../pages/Settings";
import RedirectPage from "../pages/Redirect";
import NotFound from "../pages/NotFound";

export interface IRoute {
    path: string;
    element: ReactElement;
    exact?: boolean;
    key: string;
}

export enum RouteNames {
    NOT_FOUND = "*",
    HOME = "/",
    NO_AUTH = "/no_auth",
    SETTINGS = "/settings",
    REDIRECT = "/redirect",
}

export const publicRoutes: IRoute[] = [
    {path: RouteNames.HOME, key: RouteNames.HOME, element: <Home />},
    {path: RouteNames.NO_AUTH, key: RouteNames.NO_AUTH, element: <NoAuth />},
    {path: RouteNames.SETTINGS, key: RouteNames.SETTINGS, element: <SettingsPage />},
    {path: RouteNames.REDIRECT, key: RouteNames.REDIRECT, element: <RedirectPage />},
    {path: RouteNames.NOT_FOUND, key: RouteNames.NOT_FOUND, element: <NotFound />}
]

export const privateRoutes: IRoute[] = [
    {path: RouteNames.HOME, key: RouteNames.HOME, element: <Home />},
    {path: RouteNames.NO_AUTH, key: RouteNames.NO_AUTH, element: <NoAuth />},
    {path: RouteNames.SETTINGS, key: RouteNames.SETTINGS, element: <SettingsPage />},
    {path: RouteNames.NOT_FOUND, key: RouteNames.NOT_FOUND, element: <NotFound />}
]
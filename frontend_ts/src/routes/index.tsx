import {ReactElement} from "react";
import HomePage from "../pages/HomePage";
import NoAuth from "../pages/NoAuthPage";
import {SettingsPage} from "../pages/SettingsPage";
import RedirectPage from "../pages/RedirectPage";
import NotFoundPage from "../pages/NotFoundPage";
import CoursePage from "../pages/CoursePage";
import LessonPage from "../pages/LessonPage";
import TaskPage from "../pages/TaskPage";

export interface IRoute {
    path: string;
    element: ReactElement;
    exact?: boolean;
    key: string;
}

export enum RouteNames {
    NOT_FOUND = "*",
    HOME = "/",
    NO_AUTH = "/*",
    SETTINGS = "/settings",
    REDIRECT = "/redirect",
    COURSE = "/group/:groupId/course/:courseId",
    LESSON = "/group/:groupId/course/:courseId/lesson/:lessonId",
    TASK = "/group/:groupId/course/:courseId/lesson/:lessonId/task/:taskId"
}

export const publicRoutes: IRoute[] = [
    {path: RouteNames.REDIRECT, key: RouteNames.REDIRECT, element: <RedirectPage />},
    {path: RouteNames.NO_AUTH, key: RouteNames.NO_AUTH, element: <NoAuth />},
]

export const privateRoutes: IRoute[] = [
    {path: RouteNames.REDIRECT, key: RouteNames.REDIRECT, element: <RedirectPage />},
    {path: RouteNames.HOME, key: RouteNames.HOME, element: <HomePage />},
    {path: RouteNames.SETTINGS, key: RouteNames.SETTINGS, element: <SettingsPage />},
    {path: RouteNames.NOT_FOUND, key: RouteNames.NOT_FOUND, element: <NotFoundPage />},
    {path: RouteNames.COURSE, key: RouteNames.COURSE, element: <CoursePage />},
    {path: RouteNames.LESSON, key: RouteNames.LESSON, element: <LessonPage />},
    {path: RouteNames.TASK, key: RouteNames.TASK, element: <TaskPage />},
]
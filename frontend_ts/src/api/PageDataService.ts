import {IRequestConfig, request} from "./api";
import {ICourse} from "../models/ICourse";
import {IGroup} from "../models/IGroup";
import {ICoursePageData} from "../models/ICoursePageData";
import {ISolution, ITaskWithSolution} from "../models/ITask";
import {ILessonPageData} from "../models/ILessonPageData";


export default class PageDataService {
    static async getGroups(): Promise<IGroup[]> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/page_data/groups`,
            auth: true
        }
        return await request(requestConfig)
    }
    static async getGroupCourses(group_id: number | string): Promise<ICourse[]> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/page_data/group/${group_id}/courses`,
            auth: true
        }
        return request(requestConfig)
    }
    static async getGroupCourseLessons(group_id: number | string,
                                       course_id: number | string): Promise<ICoursePageData> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/page_data/group/${group_id}/course/${course_id}/lessons`,
            auth: true
        }
        return request(requestConfig)
    }
    static async getGroupCourseLessonTasks(group_id: number | string,
                                           course_id: number | string,
                                           lesson_id: number | string): Promise<ILessonPageData> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/page_data/group/${group_id}/course/${course_id}/lesson/${lesson_id}/tasks`,
            auth: true
        }
        return request(requestConfig)
    }

    static async getGroupCourseLessonTask(group_id: number | string,
                                          course_id: number | string,
                                          lesson_id: number | string,
                                          task_id: number | string): Promise<ITaskWithSolution> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/page_data/group/${group_id}/course/${course_id}/lesson/${lesson_id}/task/${task_id}`,
            auth: true,
        }
        return request(requestConfig)
    }
    static async getTaskSolutions(group_id: number | string,
                                  course_id: number | string,
                                  lesson_id: number | string,
                                  task_id: number | string,
                                  last_solution: boolean = false): Promise<ISolution> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/page_data/group/${group_id}/course/${course_id}/lesson/${lesson_id}/task/${task_id}/solutions`,
            auth: true,
            params: {last_solution: last_solution}
        }
        return request(requestConfig)
    }
    static async postTaskSolution(group_id: number | string,
                                  course_id: number | string,
                                  lesson_id: number | string,
                                  task_id: number | string,
                                  files: FileList) {
        const formData = new FormData()
        formData.append("file", files[0], files[0].name)
        const requestConfig: IRequestConfig = {
            method: "post",
            url: `/page_data/group/${group_id}/course/${course_id}/lesson/${lesson_id}/task/${task_id}`,
            auth: true,
            headers: {'Content-Type': 'multipart/form-data'},
            data: formData
        }
        return await request(requestConfig)
    }

}
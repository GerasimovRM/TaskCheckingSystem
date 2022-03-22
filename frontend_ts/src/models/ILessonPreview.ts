import {IGroupRole} from "./IGroupRole";

export interface ILessonPreview {
    groupId: string | number;
    lessonId: string |number;
    name: string;
    courseId: string | number;
    groupRole: IGroupRole;
}
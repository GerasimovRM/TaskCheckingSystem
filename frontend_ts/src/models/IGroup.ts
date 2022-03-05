export enum UserRole {
    STUDENT = "STUDENT",
    OWNER = "OWNER",
    TEACHER = "TEACHER"
}

export interface IGroup {
    id: number;
    name: string;
    role: UserRole;
}

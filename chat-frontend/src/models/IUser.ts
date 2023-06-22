export interface IUser {
    id: number;
    first_name: string;
    last_name: string;
    middle_name: string | null;
    vk_id: string | number;
    avatar_url: string;
}
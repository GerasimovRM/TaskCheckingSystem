import {IChatMessage} from "../models/IChatMessage";
import {IRequestConfig, request} from "../api/api";

export default class ChatMessageService {
    static async getChatMessages(group_id: number | string,
                                 course_id: number | string,
                                 task_id: number | string,
                                 user_id?: number | string): Promise<IChatMessage[]> {
        const requestConfig: IRequestConfig = {
            method: "get",
            url: `/chat_message/get_all`,
            auth: true,
            params: {group_id, course_id, task_id, user_id}
        }
        return request(requestConfig)
    }
    static async postChatMessage(group_id: number | string,
                                 course_id: number | string,
                                 task_id: number | string,
                                 user_id: number | string | undefined,
                                 message_text: string): Promise<any> {
        const requestConfig: IRequestConfig = {
            method: "post",
            url: `/chat_message/post_one`,
            auth: true,
            params: {group_id, course_id, task_id, user_id, message_text}
        }
        return request(requestConfig)
    }
}
import { IChatMessage } from "../models/IChatMessage"
import IFetchConfig from "../models/IFetchConfig"
import Api from "../api/Api"

class ChatService {
    static async getChatMessages(group_id: number | string,
        course_id: number | string,
        task_id: number | string,
        user_id?: number | string): Promise<IChatMessage[]> {
            const requestConfig: IFetchConfig = {
                method: "GET",
                url: '/chat_message/get_all',
                params: {group_id, course_id, task_id, user_id}
            }
            return Api(requestConfig);
        }
}

export default ChatService
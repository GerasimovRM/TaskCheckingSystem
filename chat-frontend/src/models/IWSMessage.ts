import { WSEvents } from "../common/WSEvents"

export default interface IWSMessage {
    event: WSEvents,
    auth?: string,
    data: {
        group_id: number | string,
        course_id: number | string,
        task_id: number | string,
        message_text: string,
        user_id?: number | string
    }
}
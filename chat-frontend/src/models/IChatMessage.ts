export interface IChatMessage {
    id: number,
    task_id: number,
    user_id: number,
    from_id: number
    course_id: number,
    group_id: number,
    message_text: string,
    date: Date,
}
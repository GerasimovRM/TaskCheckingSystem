import {
    AddChatMessageAction,
    ChatMessageActionEnum,
    ClearChatMessagesAction,
    SetChatMessagesAction,
    SetErrorChatMessagesAction,
    SetIsLoadingChatMessageAction
} from "./types";
import {IChatMessage} from "../../../models/IChatMessage";
import {AppDispatch} from "../../index";
import ChatMessageService from "../../../services/ChatMessageService";

export const ChatMessagesActionCreators = {
    clearChatMessages: (): ClearChatMessagesAction => ({type: ChatMessageActionEnum.CLEAR_CHAT_MESSAGES}),
    addChatMessage: (payload: IChatMessage): AddChatMessageAction => ({type: ChatMessageActionEnum.ADD_CHAT_MESSAGE, payload}),
    setChatMessages: (payload: IChatMessage[]): SetChatMessagesAction => ({type: ChatMessageActionEnum.SET_CHAT_MESSAGES, payload}),
    setErrorChatMessages: (payload: string): SetErrorChatMessagesAction => ({type: ChatMessageActionEnum.SET_CHAT_MESSAGES_ERROR, payload}),
    setIsLoadingChatMessages: (payload: boolean): SetIsLoadingChatMessageAction => ({type: ChatMessageActionEnum.SET_CHAT_MESSAGES_IS_LOADING, payload}),
    fetchChatMessages: (groupId: number | string,
                        courseId: number | string,
                        taskId: number | string,
                        userId?: number | string) => async (dispatch: AppDispatch) => {
        dispatch(ChatMessagesActionCreators.setIsLoadingChatMessages(true))
        const messages = await ChatMessageService.getChatMessages(groupId, courseId, taskId, userId)
        if (messages) {
            dispatch(ChatMessagesActionCreators.setChatMessages(messages))
        }
        dispatch(ChatMessagesActionCreators.setIsLoadingChatMessages(false))
    },
    postChatMessage: (groupId: number | string,
                      courseId: number | string,
                      taskId: number | string,
                      userId: number | string | undefined,
                      message: string) => async (dispatch: AppDispatch) => {
        const newMessage = await ChatMessageService.postChatMessage(groupId, courseId, taskId, userId, message)
        dispatch(ChatMessagesActionCreators.setIsLoadingChatMessages(true))
        dispatch(ChatMessagesActionCreators.addChatMessage(newMessage))
    }
}

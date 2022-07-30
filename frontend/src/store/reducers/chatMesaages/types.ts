import {ISolution} from "../../../models/ISolution";
import {IChatMessage} from "../../../models/IChatMessage";

export interface ChatMessagesState {
    chatMessages: IChatMessage[];
    isLoadingChatMessages: boolean;
    errorChatMessages?: string;
}

export enum ChatMessageActionEnum {
    CLEAR_CHAT_MESSAGES = "CLEAR_CHAT_MESSAGES",
    ADD_CHAT_MESSAGE = "ADD_CHAT_MESSAGE",
    SET_CHAT_MESSAGES_ERROR = "SET_CHAT_MESSAGE_ERROR",
    SET_CHAT_MESSAGES_IS_LOADING = "SET_CHAT_MESSAGE_IS_LOADING",
    SET_CHAT_MESSAGES = "SET_CHAT_MESSAGES"
}

export interface ClearChatMessagesAction {
    type: ChatMessageActionEnum.CLEAR_CHAT_MESSAGES
}

export interface AddChatMessageAction {
    type: ChatMessageActionEnum.ADD_CHAT_MESSAGE
    payload: IChatMessage;
}
export interface SetErrorChatMessagesAction {
    type: ChatMessageActionEnum.SET_CHAT_MESSAGES_ERROR
    payload: string;
}
export interface SetIsLoadingChatMessageAction {
    type: ChatMessageActionEnum.SET_CHAT_MESSAGES_IS_LOADING
    payload: boolean;
}

export interface SetChatMessagesAction {
    type: ChatMessageActionEnum.SET_CHAT_MESSAGES,
    payload: IChatMessage[]
}

export type ChatMessagesAction = ClearChatMessagesAction |
    AddChatMessageAction |
    SetErrorChatMessagesAction |
    SetIsLoadingChatMessageAction |
    SetChatMessagesAction
import {ChatMessageActionEnum, ChatMessagesAction, ChatMessagesState} from "./types";

const initialState: ChatMessagesState = {
    isLoadingChatMessages: false,
    chatMessages: []
}

export default function chatMessageReducer(state: ChatMessagesState = initialState, action: ChatMessagesAction): ChatMessagesState {
    switch (action.type) {
        case ChatMessageActionEnum.CLEAR_CHAT_MESSAGES:
            return {...initialState}
        case ChatMessageActionEnum.ADD_CHAT_MESSAGE:
            return {...state, chatMessages: [...state.chatMessages, action.payload], isLoadingChatMessages: false}
        case ChatMessageActionEnum.SET_CHAT_MESSAGES_ERROR:
            return {...state, errorChatMessages: action.payload, isLoadingChatMessages: false}
        case ChatMessageActionEnum.SET_CHAT_MESSAGES_IS_LOADING:
            return {...state, isLoadingChatMessages: action.payload}
        case ChatMessageActionEnum.SET_CHAT_MESSAGES:
            return {...state, chatMessages: action.payload}
        default:
            return state;
    }
}
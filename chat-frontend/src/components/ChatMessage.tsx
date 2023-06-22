import React, {useEffect} from 'react';

import ChatBlob from './ChatBlob';
import {IChatMessage} from "../models/IChatMessage";
import { IUser } from '../models/IUser';

interface Props {
    message: IChatMessage,
    authUser: IUser,
    selectedUser: IUser
}

export const ChatMessage: (props: Props) => JSX.Element = (props: Props) => {
    return (
        <ChatBlob user_id={props.message.from_id} 
        text={props.message.message_text} 
        date={props.message.date}
        authUser={props.authUser}/>
    );
}
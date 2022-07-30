import React, {useEffect} from 'react';

import {Box, Flex, Image} from '@chakra-ui/react';

import ChatBlob from './ChatBlob';
import {IChatMessage} from "../models/IChatMessage";
import {useTypedSelector} from "../hooks/useTypedSelector";

export const ChatMessage: (props: IChatMessage) => JSX.Element = (props: IChatMessage) => {
    return (
        <ChatBlob user_id={props.from_id} text={props.message_text} date={props.date}/>
    );
}
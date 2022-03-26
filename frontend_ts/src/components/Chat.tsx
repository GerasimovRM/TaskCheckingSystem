import React, {useEffect, useState} from 'react';

import {Flex, Box, Button} from '@chakra-ui/react';

import ChatInput from './ChatInput';
import {ChatMessage} from "./ChatMessage";
import {IChatMessage} from "../models/IChatMessage";
import ChatMessageService from "../services/ChatMessageService";
import {useParams} from "react-router";
import {BaseSpinner} from "./BaseSpinner";
import {useTypedSelector} from "../hooks/useTypedSelector";


export default function Chat() {
    const [messages, setMessages] = useState<IChatMessage[]>()
    const {groupId, courseId, taskId} = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const {selectedUser, isLoading: isLoadingSelectedUser} = useTypedSelector(state => state.selectedUser)
    useEffect(() => {
        ChatMessageService.getChatMessages(groupId!, courseId!, taskId!, selectedUser?.id)
            .then((data) => {
                setMessages(data)
                setIsLoading(false)
            })
    }, [selectedUser, isLoadingSelectedUser])
    if (isLoading)
        return <BaseSpinner/>
    return (
        <Flex direction="column" h="100%" padding='0.5em'>
            <Box>
                {messages?.map((message, index) => {
                        return <ChatMessage key={index} {...message}/>
                    }
                )}
            </Box>
            <Box>
                <ChatInput/>
            </Box>
        </Flex>
    );
}
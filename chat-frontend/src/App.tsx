import React, {useContext, useEffect, useRef, useState} from 'react';

import {Flex, Box, Button, Spinner, Center} from '@chakra-ui/react';

import ChatInput from './components/ChatInput';
import {ChatMessage} from "./components/ChatMessage";
import {useParams} from "react-router";
import { IChatMessage } from './models/IChatMessage';
import { IUser } from './models/IUser';
import ChatService from './services/ChatService';
import UserService from './services/UserService';

import IWSResponse from './models/IWSResponse';
import { WSEvents } from './common/WSEvents';
import IWSMessage from './models/IWSMessage';

interface Props {
    selectedUser: IUser;
    authUser: IUser;
}

const App = (props: Props) => {
    const {groupId, courseId, taskId} = useParams();
    const [chatMessages, setChatMessages] = useState<IChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const host = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_WS_URL : process.env.REACT_APP_DEV_WS_URL;
    const ws = new WebSocket(host!);
    const wsSend = (group_id: number | string,
                    course_id: number | string,
                    task_id: number | string,
                    user_id: number | string | undefined,
                    message_text: string) => {
        const req: IWSMessage = {
            event: WSEvents.SEND_MESSAGE,
            auth: localStorage.getItem('access_token')!,
            data: {
                group_id,
                course_id,
                task_id,
                user_id,
                message_text
            }
        }
        ws.send(JSON.stringify(req));
        console.log(req)
    }

    useEffect(() => {
        setIsLoading(true);
        ChatService.getChatMessages(groupId!, courseId!, taskId!).then(messages => {
            setChatMessages([...messages]);
        });
        ws.addEventListener('message', msg => {
            const json: IWSResponse = JSON.parse(msg.data);
            if (json.event === WSEvents.GET_MESSAGE) {
                setChatMessages(prev => [...prev, json.data])
            }
        });
        setIsLoading(false);
    }, []);

    return (
        <Flex direction="column" >
            <Flex maxH="60vh" direction="column" overflowY={"scroll"} width={"100%"} mb={2} overflow={"auto"} sx={{
                '&::-webkit-scrollbar': {
                    width: '16px',
                    borderRadius: '8px',
                    backgroundColor: `rgba(170, 170, 170, 0.05)`,
                },
                '&::-webkit-scrollbar-thumb': {
                    width: '16px',
                    borderRadius: '8px',
                    backgroundColor: `rgba(170, 170, 170, 0.05)`,
                },
            }}
            >
                {isLoading ? <Center><Spinner></Spinner></Center> : chatMessages?.map((message, index) => {
                        return <ChatMessage key={index} 
                        message={message}
                        selectedUser={props.selectedUser}
                        authUser={props.authUser}/>
                    }
                )}

            </Flex>

            <Box>
                <ChatInput onSend={wsSend} selectedUser={props.selectedUser}/>
            </Box>
        </Flex>
    );
}

export default App
import React from 'react';

import {Flex, Box, Button} from '@chakra-ui/react';

import ChatInput from './ChatInput';
import {ChatMessage} from "./ChatMessage";

export interface IChat {
    messages?: string[];
    event?: Function
}

export default function Chat({messages, event}: IChat) {
    return (
        <Flex direction="column" h="100%" padding='0.5em'>
            <Box>
                {messages?.sort((a, b) => {
                    const n_a = Number(a)
                    const n_b = Number(b)
                    if (n_a > n_b) return 1
                    else if (n_a < n_b) return -1
                    else return 0
                }).map((message) => {
                        if (event) {
                            return (
                                <ChatMessage key={message} userId={0} text={message}/>
                            )
                        } else {
                            return <ChatMessage userId={0} text={message}/>
                        }
                    }
                )}
            </Box>
            <Box>
                <ChatInput
                    onSend={(text: string) =>
                        new Promise((res) => {
                            setTimeout(() => {
                                console.log(text);
                                res(true);
                            }, 3000);
                        })
                    }
                />
            </Box>
        </Flex>
    );
}
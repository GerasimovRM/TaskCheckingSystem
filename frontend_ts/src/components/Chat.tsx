import React from 'react';

import {Flex, Box} from '@chakra-ui/react';

import ChatInput from './ChatInput';
import {ChatMessage} from "./ChatMessage";


export default function Chat() {
    return (
        <div
            style={{
                padding: '0.5em',
                height: '100%',
            }}
        >
            <Flex direction="column" h="100%">
                <Box flex="1">
                    {/*
                    <ChatMessage userId={0} text="Boy, next door"/>
                    <ChatMessage userId={1} text="Fucking slaves"/>
                    <ChatMessage userId={0} text="Fuck you, leatherman"/>
                    */}
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
        </div>
    );
}
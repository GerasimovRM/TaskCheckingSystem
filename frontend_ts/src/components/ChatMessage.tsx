import React from 'react';

import {Box, Button, Flex, Image} from '@chakra-ui/react';

import ChatBlob from './ChatBlob';
import { Link } from 'react-router-dom';

export interface IChatMessage {
    userId: number | string;
    text: string;
}

export const ChatMessage: ({ userId, text }: IChatMessage) => JSX.Element = ({ userId, text }: IChatMessage) => {
    const clientId = 1;
    const clientName = 'User';

    return (
        <Link
            to={`?solution_id=${text}`}
        >
            <Box flex="1" mb={2}>
                {clientId !== userId ? (
                    <Flex>
                        <Box>
                            <Image borderRadius="full" boxSize="32px" src={localStorage.getItem("avatar_url")!} />
                        </Box>
                        <Box
                            flex="1"
                            style={{
                                paddingLeft: '0.2em',
                            }}
                        >
                            <ChatBlob name={clientName} text={text}/>
                        </Box>
                    </Flex>
                ) : (
                    <Flex>
                        <Box flex="1">
                            <ChatBlob name={clientName} text={text} />
                        </Box>
                    </Flex>
                )}
            </Box>
        </Link>
    );
}
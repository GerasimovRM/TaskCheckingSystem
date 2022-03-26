import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import {Box, Flex, HStack, Image, Text} from '@chakra-ui/react';
import {IUser} from "../models/IUser";
import UserService from "../services/UserService";
import {BaseSpinner} from "./BaseSpinner";
import {useTypedSelector} from "../hooks/useTypedSelector";

export interface IChatBlob {
    user_id: number
    text: string
}

export default function ChatBlob({ user_id, text}: IChatBlob) {
    const [user, setUser] = useState<IUser>()
    const {user: authUser} = useTypedSelector(state => state.auth)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isSelf, setIsSelf] = useState<boolean>()
    useEffect(() =>{
        UserService.getUserById(user_id).then((user) => {
            setUser(user)
            setIsLoading(false)
        }).then(() => {
            setIsSelf(authUser!.id === user?.id)
        })
    },[isLoading])
    if (isLoading)
        return <BaseSpinner/>
    return (
        <Flex>
            <Box
                flex="1"
                style={{
                    paddingLeft: '0.2em',
                }}
            >
                <Box
                    borderWidth="1px"
                    width="100%"
                    borderRadius="md"
                    style={{
                        padding: '0.5em',
                    }}
                    textAlign={isSelf ? "start" : "end"}
                >
                    <HStack justifyContent={isSelf? "flex-start" : "flex-end"}>
                        {isSelf && <Image borderRadius="full" boxSize="32px" src={user?.avatar_url}/>}
                        <Box
                            color="gray.500"
                            fontWeight="semibold"
                            letterSpacing="wide"
                            fontSize="xs"
                        >
                            {`${user?.first_name} ${user?.last_name}`}
                        </Box>
                        {!isSelf && <Image borderRadius="full" boxSize="32px" src={user?.avatar_url}/>}
                    </HStack>
                    <Text color="gray.500"
                          wordBreak={"break-word"}
                    >
                        {text}
                    </Text>
                </Box>
            </Box>

        </Flex>
    );
}

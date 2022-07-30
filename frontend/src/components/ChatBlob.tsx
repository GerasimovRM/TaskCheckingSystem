import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import {Box, Divider, Flex, HStack, Image, Text} from '@chakra-ui/react';
import {IUser} from "../models/IUser";
import UserService from "../services/UserService";
import {BaseSpinner} from "./BaseSpinner";
import {useTypedSelector} from "../hooks/useTypedSelector";
import {useActions} from "../hooks/useActions";

export interface IChatBlob {
    user_id: number
    text: string
    date: Date
}

export default function ChatBlob({ user_id, text, date}: IChatBlob) {
    const [user, setUser] = useState<IUser>()
    const {user: authUser} = useTypedSelector(state => state.auth)
    const {selectedUser} = useTypedSelector(state => state.selectedUser)
    const {fetchUserData} = useActions()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isSelf, setIsSelf] = useState<boolean>()
    const [isLoadingChatBlob, setIsLoadingChatBlob] = useState<boolean>(false)
    const {users} = useTypedSelector(state => state.usersData)
    let format_date = new Date(date)
    format_date = new Date(Number(format_date) - new Date().getTimezoneOffset() * 60000)

    useEffect(() =>{
        if (user_id === authUser?.id) {
            setUser(authUser)
            setIsSelf(true)
            setIsLoading(false)
        }
        else {
            const loadedUser = users.find(u => u.id === user_id)
            if (loadedUser) {
                setUser(loadedUser)
                setIsSelf(false)
                setIsLoading(false)
            }
        }
    },[users])
    return (
        <Box mb={2}
            flex="1"
            style={{
                padding: '0.5em',
            }}
             alignSelf={isSelf? "flex-start" : "flex-end"}
        >
            <Box
                borderWidth="1px"
                display={"inline-block"}
                borderRadius="md"
                style={{
                    padding: '0.5em',
                }}
            >
                <HStack justifyContent={isSelf? "flex-start" : "flex-end"}>
                    {isSelf && <Image borderRadius="full" boxSize="32px" src={user?.avatar_url}/>}
                    <Box
                        fontWeight="semibold"
                        letterSpacing="wide"
                        fontSize="xs"
                        textAlign={isSelf ? "start" : "end"}
                    >
                        {`${user?.first_name} ${user?.last_name}`}
                        <br/>
                        {format_date.toLocaleString()}
                    </Box>
                    {!isSelf && <Image borderRadius="full" boxSize="32px" src={user?.avatar_url}/>}
                </HStack>
                <Divider/>
                <Text
                      wordBreak={"break-word"}
                >
                    {text}
                </Text>
            </Box>
        </Box>
    );
}

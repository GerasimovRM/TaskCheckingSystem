import React, {useContext, useState} from 'react';

import {
    InputGroup,
    Input,
    InputRightElement,
    IconButton,
    useToast, FormControl,
} from '@chakra-ui/react';

import {MdSend} from 'react-icons/md';
import {useParams} from "react-router";
import { IUser } from '../models/IUser';

export interface IChatInput {
    onSend: CallableFunction,
    selectedUser: IUser
}

const ChatInput = ({onSend, selectedUser}: IChatInput) => {
    const [value, setValue] = useState('');
    const toast = useToast();
    const {groupId, courseId, taskId} = useParams();
    return (
        <FormControl
            onKeyPress={(event) => {
                if (event.key === 'Enter') {
                    if (value.trim()) {
                        onSend(groupId!, courseId!, taskId!, selectedUser?.id, value)
                        setValue('');
                        toast({
                            title: 'Сообщение отправлено',
                            status: 'success',
                            duration: 4000,
                            isClosable: true,
                            position: 'bottom-right',
                        })
                    }
                }
            }}
        >
            <InputGroup size="md">
                <Input
                    pr="4.5rem"
                    type="text"
                    placeholder="Ваше сообщение"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                />
                <InputRightElement>
                    <IconButton
                        h="1.75rem"
                        size="sm"
                        icon={<MdSend/>}
                        aria-label="Send"
                        color="teal.300"
                        type="submit"
                        onClick={() => {
                            if (value.trim()) {
                                onSend(groupId!, courseId!, taskId!, selectedUser?.id, value)
                                setValue('');
                                toast({
                                    title: 'Сообщение отправлено',
                                    status: 'success',
                                    duration: 4000,
                                    isClosable: true,
                                    position: 'bottom-right',
                                })
                            }
                        }}
                    />
                </InputRightElement>
            </InputGroup>
        </FormControl>
    );
};

export default ChatInput
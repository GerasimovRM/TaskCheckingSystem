import React, {useState} from 'react';

import {
    InputGroup,
    Input,
    InputRightElement,
    IconButton,
    useToast, FormControl,
} from '@chakra-ui/react';

import {MdSend} from 'react-icons/all';
import ChatMessageService from "../services/ChatMessageService";
import {useParams} from "react-router";
import {useTypedSelector} from "../hooks/useTypedSelector";
import {BaseSpinner} from "./BaseSpinner";
import {useActions} from "../hooks/useActions";

export interface IChatInput {

}

export default function ChatInput({}: IChatInput) {
    const [value, setValue] = useState('');
    const toast = useToast();
    const {selectedUser} = useTypedSelector(state => state.selectedUser)
    const {groupId, courseId, taskId} = useParams();
    const {postChatMessage} = useActions()
    return (
        <FormControl
            onKeyPress={(event) => {
                if (event.key === 'Enter') {
                    if (value.trim()) {
                        postChatMessage(groupId!, courseId!, taskId!, selectedUser?.id, value)
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
                                postChatMessage(groupId!, courseId!, taskId!, selectedUser?.id, value)
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
}

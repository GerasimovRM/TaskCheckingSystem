import React, { useState } from 'react';

import {
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  useToast,
} from '@chakra-ui/react';

import { MdSend } from 'react-icons/all';

export interface ChatInputProps {
  onSend?: (text: string) => Promise<boolean>;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  return (
    <InputGroup size="md" bgColor="white">
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
          icon={<MdSend />}
          aria-label="Send"
          color="teal.300"
          isLoading={loading}
          onClick={() => {
            if (value.trim()) {
              setValue('');
              toast({
                title: 'Сообщение отправлено',
                status: 'success',
                duration: 4000,
                isClosable: true,
                position: 'bottom-right',
              });
              if (onSend) {
                setLoading(true);
                onSend(value).then(() => {
                  setLoading(false);
                });
              }
            }
          }}
        />
      </InputRightElement>
    </InputGroup>
  );
}

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Box, Divider, Flex, HStack, Image, Text } from "@chakra-ui/react";
import { IUser } from "../models/IUser";
import UserService from "../services/UserService";
import { BaseSpinner } from "./BaseSpinner";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useActions } from "../hooks/useActions";

import "./ChatBlob.css";

export interface IChatBlob {
  user_id: number;
  text: string;
  date: Date;
}

export default function ChatBlob({ user_id, text, date }: IChatBlob) {
  const [user, setUser] = useState<IUser>();
  const { user: authUser } = useTypedSelector((state) => state.auth);
  const { selectedUser } = useTypedSelector((state) => state.selectedUser);
  const { fetchUserData } = useActions();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSelf, setIsSelf] = useState<boolean>();
  const [isLoadingChatBlob, setIsLoadingChatBlob] = useState<boolean>(false);
  const { users } = useTypedSelector((state) => state.usersData);
  let format_date = new Date(date);
  format_date = new Date(
    Number(format_date) - new Date().getTimezoneOffset() * 60000
  );

  useEffect(() => {
    if (user_id === authUser?.id) {
      setUser(authUser);
      setIsSelf(true);
      setIsLoading(false);
    } else {
      const loadedUser = users.find((u) => u.id === user_id);
      if (loadedUser) {
        setUser(loadedUser);
        setIsSelf(false);
        setIsLoading(false);
      } else {
      }
    }
  }, [users]);
  return (
    <Box className={"chat-blob"} alignSelf={isSelf ? "flex-start" : "flex-end"}>
      <Box className={"chat-blob__content"}>
        <HStack justifyContent={isSelf ? "flex-start" : "flex-end"}>
          {isSelf && (
            <Image className={"chat-blob__image"} src={user?.avatar_url} />
          )}
          <Box
            className={"chat-blob__user"}
            textAlign={isSelf ? "start" : "end"}
          >
            {`${user?.first_name} ${user?.last_name}`}
            <br />
            {format_date.toLocaleString()}
          </Box>
          {!isSelf && (
            <Image className={"chat-blob__image"} src={user?.avatar_url} />
          )}
        </HStack>
        <Divider />
        <Text className={"chat-blob__text"}>{text}</Text>
      </Box>
    </Box>
  );
}

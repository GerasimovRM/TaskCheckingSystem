import React, { useContext, useEffect, useState } from "react";

import { Box, Divider, Flex, HStack, Image, Skeleton, Text } from "@chakra-ui/react";
import { IUser } from "../models/IUser";

import "./ChatBlob.css";
import UserService from "../services/UserService";

export interface IChatBlob {
  user_id: number;
  text: string;
  date: Date;
  authUser: IUser;
}

const ChatBlob = ({ user_id, text, date, authUser }: IChatBlob) => {
  const [user, setUser] = useState<IUser>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSelf, setIsSelf] = useState<boolean>();
  let format_date = new Date(date);
  format_date = new Date(
    Number(format_date) - new Date().getTimezoneOffset() * 60000
  );
  useEffect(() => {
    setIsLoading(true);
    UserService.fetchUserData(user_id).then(
      user => {
        setUser(user);
        if (user.id === authUser.id) setIsSelf(true);
        setIsLoading(false);
      }
    );
  }, []);
  return (
    <Box className={"chat-blob"} alignSelf={isSelf ? "flex-start" : "flex-end"}>
      <Skeleton isLoaded={!isLoading}>
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
      </Skeleton>
    </Box>
  );
}

export default ChatBlob
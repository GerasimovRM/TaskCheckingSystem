import React, {FunctionComponent} from 'react';
import { encode } from 'querystring';
import { Link } from 'react-router-dom';

import {
    Container,
    Flex,
    Spacer,
    Heading,
    Image,
    Icon,
    Center,
    WrapItem,
    Wrap,
} from '@chakra-ui/react';
import { FiSettings, SiVk } from 'react-icons/all';
import {useTypedSelector} from "../hooks/useTypedSelector";
import {useActions} from "../hooks/useActions";

export const Layout: FunctionComponent = ({ children }) => {
    const {isAuth, isLoading} = useTypedSelector(state => state.auth)
    const {logout} = useActions()

    return (
    <div>
        <Flex
            style={{
                padding: '0.5vh 3vw 3vh 3vw',
            }}
        >
            <Wrap>
                <WrapItem>
                <Center h="48px">
                <Link to="/">
                    <Heading>Logo</Heading>
                </Link>
                </Center>
                </WrapItem>
            </Wrap>

            <Spacer />
            <Flex>
                {isAuth
                    ?
                    <Link to="/">
                        <Center w="48px" h="48px">
                            <Image
                                borderRadius="full"
                                boxSize="48px"
                                src={localStorage.getItem("avatar_url") !== null ? localStorage.getItem("avatar_url")! : "https://avatars.githubusercontent.com/u/26022093?v=4"}
                                onClick={logout}
                            />
                        </Center>
                    </Link>
                    :
                    <Center w="48px" h="48px">
                        <a
                            href={`https://oauth.vk.com/authorize?${encode({
                                client_id: process.env.REACT_APP_VK_CLIENT_ID,
                                redirect_uri: `${process.env.REACT_APP_SITE_URL}/redirect`,
                                display: 'page',
                                scope: 'offline',
                                response_type: 'code',
                                v: '5.131',
                            })}`}
                        >
                            <Icon as={SiVk} w="10" h="10"/>
                        </a>
                    </Center>
                }

                <Center w="48px" h="48px">
                <Link to="/settings">
                    <Icon as={FiSettings} w="10" h="10" />
                </Link>
                </Center>
            </Flex>
        </Flex>
        <Container
            maxW="container.xl"
            paddingTop='5vh'
        >
        {children}
        </Container>
    </div>
);
}
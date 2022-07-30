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
import { FiSettings, SiVk, ImExit, ImProfile } from 'react-icons/all';
import {useTypedSelector} from "../hooks/useTypedSelector";
import {useActions} from "../hooks/useActions";
import {baseURL, vkClientId} from "../api/api";

export const Layout: FunctionComponent = ({ children }) => {
    const {isAuth, user} = useTypedSelector(state => state.auth)
    const {logout} = useActions()
    // console.log(process.env.REACT_APP_DEV_SITE_URL)
    return (
    <div >
        <Flex
            style={{
                padding: '0.5vh 3vw 3vh 3vw',
            }}
        >
            <Wrap>
                <WrapItem>
                <Center h="48px">
                <Link to="/">
                    <Image
                        borderRadius='full'
                        boxSize='48px'
                        src='https://upload.wikimedia.org/wikipedia/ru/a/ac/%D0%AD%D0%BC%D0%B1%D0%BB%D0%B5%D0%BC%D0%B0_-_%D0%9C%D0%9E%D0%A3_%D0%9B%D0%B8%D1%86%D0%B5%D0%B9_%E2%84%961_%28%D0%9F%D0%B5%D1%80%D0%BC%D1%8C%29.gif'
                        alt='Lyceum 1 Logo'
                    />
                </Link>
                </Center>
                </WrapItem>
            </Wrap>

            <Spacer />
            <Flex>
                {isAuth
                    ?
                    <>
                        <Link to="/settings">
                            <Center w="48px" h="48px">
                                <Icon as={FiSettings}
                                      w="10"
                                      h="10"
                                />
                            </Center>
                        </Link>
                        <Link to="/">
                            <Center w="48px" h="48px">
                                <Icon
                                    w="10"
                                    h="10"
                                    as={ImProfile}
                                />
                            </Center>
                        </Link>
                        <Link to="/">
                            <Center w="48px" h="48px">
                                <Icon
                                    w="10"
                                    h="10"
                                    as={ImExit}
                                    onClick={logout}
                                />
                            </Center>
                        </Link>
                    </>
                    :
                    <>
                        <Link to="/settings">
                            <Center w="48px" h="48px">
                                <Icon as={FiSettings} w="10" h="10"/>
                            </Center>
                        </Link>
                        <Center w="48px" h="48px">
                            <a
                                href={`https://oauth.vk.com/authorize?${encode({
                                    client_id: vkClientId,
                                    redirect_uri: `${baseURL}/redirect`,
                                    display: 'page',
                                    scope: 'offline',
                                    response_type: 'code',
                                    v: '5.131',
                                })}`}
                            >
                                <Icon as={SiVk} w="10" h="10"/>
                            </a>
                        </Center>
                    </>

                }
            </Flex>
        </Flex>
        <Container
            paddingTop='2vh'
            maxW="inherit"
            paddingLeft="10vh"
            paddingRight="10vh"
        >
        {children}
        </Container>
    </div>
);
}
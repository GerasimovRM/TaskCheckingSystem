import React, {FunctionComponent} from 'react';
import { encode } from 'querystring';
import { Link } from 'react-router-dom';

import {
    Flex,
    Spacer,
    Image,
    Icon,
    Center,
    WrapItem,
    Wrap, useColorMode,
} from '@chakra-ui/react';
import { FiSettings, SiVk, ImExit, ImProfile } from 'react-icons/all';
import {useTypedSelector} from "../../hooks/useTypedSelector";
import {useActions} from "../../hooks/useActions";
import {baseURL, vkClientId} from "../../api/api";

export const MainHeader: FunctionComponent = () => {
    const {isAuth, user} = useTypedSelector(state => state.auth)
    const {logout} = useActions()
    // console.log(process.env.REACT_APP_DEV_SITE_URL)
    const {colorMode} = useColorMode()
    return (
        <div>
            <Flex
                style={{
                    padding: '0.5vh 3vw 3vh 3vw',
                }}
            >
                <Wrap>
                    <WrapItem>
                        <Center h="48px" w="48px">
                            <Link to="/">
                                <Image
                                    borderRadius='full'
                                    boxSize='48px'
                                    src={colorMode === 'dark' ?
                                        require('../../icons/logo_dark.png') :
                                        require('../../icons/logo_light.png')
                                    }
                                    alt='Lyceum 1 Logo'
                                />
                            </Link>
                        </Center>
                    </WrapItem>
                </Wrap>

                <Spacer/>
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
                            <Link to="/profile">
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
        </div>
    );
}
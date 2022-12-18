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

import './MainHeader.css';

export const MainHeader: FunctionComponent = () => {
    const {isAuth, user} = useTypedSelector(state => state.auth)
    const {logout} = useActions()
    // console.log(process.env.REACT_APP_DEV_SITE_URL)
    const {colorMode} = useColorMode()
    return (
        <div> {/* Но можно div или header оставить*/}
            <Flex className={'header'}> {/* Flex was here */}
                <Wrap>
                    <WrapItem>
                        <Center className={'header__link'}>
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
                                <Center className={'header__link'}>
                                    <Icon as={FiSettings}
                                          w="10"
                                          h="10"
                                    />
                                </Center>
                            </Link>
                            <Link to="/profile">
                                <Center className={'header__link'}>
                                    <Icon
                                        w="10"
                                        h="10"
                                        as={ImProfile}
                                    />
                                </Center>
                            </Link>
                            <Link to="/">
                                <Center className={'header__link'}>
                                    <Icon
                                        w="10"
                                        h="20"
                                        as={ImExit}
                                        onClick={logout}
                                    />
                                </Center>
                            </Link>
                        </>
                        :
                        <>
                            <Link to="/settings">
                                <Center className={'header__link'}>
                                    <Icon as={FiSettings} w="10" h="10"/>
                                </Center>
                            </Link>
                            <Center className={'header__link'}>
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
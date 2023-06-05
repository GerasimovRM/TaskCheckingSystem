import React, {FunctionComponent, Suspense, useContext} from 'react';
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
import { FiSettings, SiVk, ImExit, ImProfile, AiOutlineLogin } from 'react-icons/all';
import {baseURL, vkClientId} from "../../api/api";

import './MainHeader.css';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../context';

// @ts-ignore
const Notifications = React.lazy(() => import('notifications/App'));

export const MainHeader: FunctionComponent = observer(() => {
    const RS = useContext(RootStoreContext);
    const {isAuth, user} = RS.authStore;
    // console.log(process.env.REACT_APP_DEV_SITE_URL)
    const {colorMode} = useColorMode()

    return (
        <div> {/* Но можно div или header оставить*/}
            <nav className={'header'}> {/* Flex was here */}
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
                            <Suspense>
                                <Center className={'header__link'}>
                                    <Notifications/>
                                </Center>
                            </Suspense>
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
                                        onClick={RS.authStore.logout}
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
                            <Link to="/auth">
                                <Center className={'header__link'}>
                                    <Icon as={AiOutlineLogin} w="10" h="10"/>
                                </Center>
                            </Link>
                        </>
                    }
                </Flex>
            </nav>
        </div>
    );
})
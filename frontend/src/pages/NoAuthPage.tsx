import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Heading} from "@chakra-ui/react";
import {BaseSpinner} from "../components/BaseSpinner";
import { RootStoreContext } from '../context';
import { observer } from 'mobx-react-lite';

const NoAuthPage: FunctionComponent = observer(() => {
    const RS = useContext(RootStoreContext);
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const encodeAccessToken = localStorage.getItem("access_token");
        if (encodeAccessToken)
            RS.authStore.loadUser();
        const timer = setTimeout(() => setIsLoading(false), 2000)
        return () => clearTimeout(timer)
    }, [])
    if (isLoading) {
        return <BaseSpinner/>
    }
    return (
        <>
            <Heading size="2xl" mb={5} style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh',
            }}>
                Не авторизован
            </Heading>
        </>
    );
});

export default NoAuthPage;
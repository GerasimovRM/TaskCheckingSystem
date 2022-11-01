import React, {FunctionComponent, useEffect, useState} from 'react';
import {Heading} from "@chakra-ui/react";
import {useActions} from "../hooks/useActions";
import {BaseSpinner} from "../components/BaseSpinner";

const NoAuthPage: FunctionComponent = () => {
    const {loadUser, setUser} = useActions()
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const encodeAccessToken = localStorage.getItem("access_token");
        if (encodeAccessToken)
            loadUser()
        const timer = setTimeout(() => setIsLoading(false), 2000)
        return () => clearTimeout(timer)
    }, [])
    if (isLoading) {
        return <BaseSpinner/>
    }
    return (
        <>
            <Heading size="2xl" mb={5}>
                Не авторизован
            </Heading>
        </>
    );
};

export default NoAuthPage;
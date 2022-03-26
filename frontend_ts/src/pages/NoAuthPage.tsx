import React, {FunctionComponent, useEffect} from 'react';
import {Heading} from "@chakra-ui/react";
import {useActions} from "../hooks/useActions";

const NoAuthPage: FunctionComponent = () => {
    const {loadUser} = useActions()

    useEffect(() => {
        const encodeAccessToken = localStorage.getItem("access_token");
        if (encodeAccessToken)
            loadUser()
    }, [])
    return (
        <>
            <Heading size="2xl" mb={5}>
                Не авторизован
            </Heading>
        </>
    );
};

export default NoAuthPage;
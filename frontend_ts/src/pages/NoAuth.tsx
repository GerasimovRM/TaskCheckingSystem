import React, {FunctionComponent} from 'react';
import {Heading} from "@chakra-ui/react";

const NoAuth: FunctionComponent = () => {
    return (
        <>
            <Heading size="2xl" mb={5}>
                Не авторизован
            </Heading>
        </>
    );
};

export default NoAuth;
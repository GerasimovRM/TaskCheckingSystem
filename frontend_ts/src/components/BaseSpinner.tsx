import React, {FunctionComponent} from 'react';

import { Spinner } from '@chakra-ui/react';

export const BaseSpinner: FunctionComponent = () => {
    return (
        <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.400"
            size="xl"
        />
    );
}

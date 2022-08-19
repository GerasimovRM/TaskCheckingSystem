import React, {FunctionComponent} from 'react';

import {Center, CircularProgress, Spinner} from '@chakra-ui/react';

export const BaseSpinner: FunctionComponent = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh',
        }}>
            <CircularProgress value={30} size='120px' isIndeterminate color='gray.300'/>
        </div>
    );
}

import React, {FunctionComponent} from 'react';

import {CircularProgress} from '@chakra-ui/react';

import './BaseSpinner.css'
export const BaseSpinner: FunctionComponent = () => {
    return (
        <main className={'spinner'}>
            <CircularProgress value={30} size='120px' isIndeterminate color='gray.300'/>
        </main>
    );
}

import React, {FunctionComponent} from 'react';

import { Button, Heading, SimpleGrid, useColorMode } from '@chakra-ui/react';

export const SettingsPage: FunctionComponent = () => {
    const { toggleColorMode } = useColorMode();
    return (
        <>
            <Heading mb={7}>Настройки</Heading>
            <SimpleGrid>
                <Button size="sm" onClick={toggleColorMode}>
                    Сменить тему
                </Button>
            </SimpleGrid>
        </>
    );
}

import React, {FunctionComponent} from 'react';

import { Button, Heading, SimpleGrid, useColorMode } from '@chakra-ui/react';
import {Layout} from "../components/layouts/Layout";

export const SettingsPage: FunctionComponent = () => {
    const { toggleColorMode } = useColorMode();
    return (
        <Layout
            headerChildren={
                <Heading mb={7}>Настройки</Heading>
            }
            mainChildren={
                <SimpleGrid>
                    <Button size="sm" onClick={toggleColorMode}>
                        Сменить тему
                    </Button>
                </SimpleGrid>
            }
        />
    );
}

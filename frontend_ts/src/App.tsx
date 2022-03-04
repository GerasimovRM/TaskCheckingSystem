import React, {FunctionComponent} from 'react';
import {BrowserRouter} from "react-router-dom";
import {Layout} from "./components/Layout";
import {ChakraProvider, ColorModeScript} from "@chakra-ui/react";
import theme from "./theme";
import AppRouter from "./components/AppRouter";
import BreadcrumbGenerator from "./components/BreadcrumbGenerator";

const App: FunctionComponent = () => {
    return (
        <ChakraProvider>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <BrowserRouter>
                <Layout>
                    <BreadcrumbGenerator />
                    <AppRouter />
                </Layout>
            </BrowserRouter>
        </ChakraProvider>
    );
}

export default App;

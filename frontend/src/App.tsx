import React, {FunctionComponent} from 'react';
import {BrowserRouter} from "react-router-dom";
import {Layout} from "./components/layouts/Layout";
import {ChakraProvider, ColorModeScript} from "@chakra-ui/react";
import theme from "./theme";
import AppRouter from "./components/AppRouter";
import {MainHeader} from "./components/layouts/MainHeader";

const App: FunctionComponent = () => {
    return (
        <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <BrowserRouter>
                <MainHeader/>
                <AppRouter />
            </BrowserRouter>
        </ChakraProvider>
    );
}

export default App;

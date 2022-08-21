import React, {FunctionComponent, JSXElementConstructor} from 'react';
import {encode} from 'querystring';
import {Link} from 'react-router-dom';

import {
    Container,
    Flex,
    Spacer,
    Heading,
    Image,
    Icon,
    Center,
    WrapItem,
    Wrap, useColorMode, Grid, GridItem, VStack,
} from '@chakra-ui/react';
import {useTypedSelector} from "../../hooks/useTypedSelector";
import {useActions} from "../../hooks/useActions";
import BreadcrumbGenerator from "../BreadcrumbGenerator";

interface LayoutChildren {
    headerChildren?: React.ReactNode
    mainChildren: React.ReactNode
    asideChildren?: React.ReactNode
    footerChildren?: React.ReactNode

}

export const Layout: React.FC<LayoutChildren> = ({
                                                     headerChildren,
                                                     mainChildren,
                                                     footerChildren,
                                                     asideChildren
                                                 }: LayoutChildren) => {
    const {isAuth, user} = useTypedSelector(state => state.auth)
    const {logout} = useActions()
    // console.log(process.env.REACT_APP_DEV_SITE_URL)
    const {colorMode} = useColorMode()
    return (
        <Grid templateAreas={
            `"header header"
            "main aside"
            "main aside"
            "footer footer"`}
              gridTemplateRows={'1fr 3fr 3fr 1fr'}
              gridTemplateColumns={"3fr 1fr"}
              gap={3}
              paddingLeft={"5vh"}
              paddingRight={"5vh"}
        >

            <GridItem area={"header"}>
                <VStack alignItems={"flex"}>
                    <BreadcrumbGenerator/>
                    {headerChildren}
                </VStack>
            </GridItem>

            <GridItem area={"main"}>
                {mainChildren}
            </GridItem>

            <GridItem area={"aside"}>
                <VStack>
                    {asideChildren}
                </VStack>
            </GridItem>

            <GridItem area={"footer"}>
                <VStack>
                    {footerChildren}
                </VStack>
            </GridItem>

        </Grid>
    );
}
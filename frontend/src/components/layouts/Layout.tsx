import React, {FunctionComponent, JSXElementConstructor, useContext} from 'react';
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
    Wrap, useColorMode, Grid, GridItem, VStack, ResponsiveValue, GridOptions,
} from '@chakra-ui/react';
import BreadcrumbGenerator from "../BreadcrumbGenerator";

interface LayoutChildren {
    headerChildren?: React.ReactNode
    mainChildren: React.ReactNode
    asideChildren?: React.ReactNode
    footerChildren?: React.ReactNode
    noPadding?: boolean
    gridTemplateColumns?: string
}

export const Layout: React.FC<LayoutChildren> = ({
                                                     headerChildren,
                                                     mainChildren,
                                                     footerChildren,
                                                     asideChildren,
                                                     noPadding,
                                                     gridTemplateColumns
                                                 }: LayoutChildren) => {
    // console.log(process.env.REACT_APP_DEV_SITE_URL)
    const {colorMode} = useColorMode()
    const templateRows = [
        headerChildren ? `"header header"` : null,
        asideChildren ? `"main aside"` : `"main main"`,
        asideChildren ? `"main aside"` : `"main main"`,
        footerChildren ? `"footer footer"` : null
    ]
    const templateAreas = templateRows.filter((x) => x !== null).join("\n")
    const gridRows = (headerChildren ? "1fr " : "") + "3fr 3fr" + (footerChildren ? " 1fr" : "")
    return (
        <Grid templateAreas={templateAreas}
              gridTemplateRows={gridRows}
              gridTemplateColumns={gridTemplateColumns || "3fr 1fr"}
              gap={3}
              paddingLeft={noPadding ? undefined : "5vh"}
              paddingRight={noPadding ? undefined : "5vh"}
              paddingBottom={noPadding ? undefined : "5vh"}
        >
            {headerChildren &&
                <GridItem area={"header"}>
                    <VStack alignItems={"flex"}>
                        <BreadcrumbGenerator/>
                        {headerChildren}
                    </VStack>
                </GridItem>
            }

            <GridItem area={"main"}>
                {mainChildren}
            </GridItem>
            {asideChildren &&
                <GridItem area={"aside"}>
                    <VStack>
                        {asideChildren}
                    </VStack>
                </GridItem>
            }
            {footerChildren &&
                <GridItem area={"footer"}>
                    <VStack>
                        {footerChildren}
                    </VStack>
                </GridItem>
            }

        </Grid>
    );
}
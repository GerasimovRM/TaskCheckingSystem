import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  Container,
  Flex,
  Spacer,
  Heading,
  Image,
  Icon,
  Center,
  WrapItem,
  Wrap,
} from '@chakra-ui/react';
import { BsGear, BsGearFill } from 'react-icons/all';

export interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div>
      <Flex
        style={{
          padding: '0.5vh 3vw 3vh 3vw',
        }}
      >
        <Wrap>
          <WrapItem>
            <Center h="48px">
              <Link to="/">
                <Heading>Logo</Heading>
              </Link>
            </Center>
          </WrapItem>
        </Wrap>

        <Spacer />
        <Image
          borderRadius="full"
          boxSize="48px"
          src="https://avatars.githubusercontent.com/u/26022093?v=4"
        />
        <Wrap
          style={{
            paddingLeft: '0.5vw',
          }}
        >
          <WrapItem>
            <Center w="48px" h="48px">
              <Link to="/settings">
                <Icon
                  as={location.pathname === '/settings' ? BsGearFill : BsGear}
                  w="10"
                  h="10"
                />
              </Link>
            </Center>
          </WrapItem>
        </Wrap>
      </Flex>
      <Container
        maxW="container.xl"
        style={{
          paddingTop: '5vh',
        }}
      >
        {children}
      </Container>
    </div>
  );
}

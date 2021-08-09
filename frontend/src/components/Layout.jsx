import React from 'react';
import PropTypes from 'prop-types';
import { encode } from 'querystring';
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
import { FiSettings, SiVk } from 'react-icons/all';
import { vkClientId } from '../vk';

export default function Layout({ children }) {
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
        <Flex>
          <Center w="48px" h="48px">
            <a
              href={`https://oauth.vk.com/authorize?${encode({
                client_id: vkClientId,
                redirect_uri: 'http://localhost:3000/redirect',
                display: 'page',
                scope: 'offline',
                response_type: 'code',
                v: '5.131',
              })}`}
            >
              {false ? (
                <Image
                  borderRadius="full"
                  boxSize="48px"
                  src="https://avatars.githubusercontent.com/u/26022093?v=4"
                />
              ) : (
                <Icon as={SiVk} w="10" h="10" />
              )}
            </a>
          </Center>
          <Center w="48px" h="48px">
            <Link to="/settings">
              <Icon as={FiSettings} w="10" h="10" />
            </Link>
          </Center>
        </Flex>
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

Layout.propTypes = {
  children: PropTypes.node,
};

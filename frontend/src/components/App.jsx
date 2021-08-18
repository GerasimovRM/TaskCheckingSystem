import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';

import Layout from './Layout';

import HomePage from '../pages/home';
import TaskPage from '../pages/task';

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Layout>
          <Route path="/" exact component={HomePage} />
          <Route path="/task" component={TaskPage} />
        </Layout>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;

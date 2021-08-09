import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';

import Layout from './Layout';

import CoursesPage from '../pages/courses';
import CoursePage from '../pages/course';
import LessonPage from '../pages/lesson';
import TaskPage from '../pages/task';

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Layout>
          <Route path="/" exact component={CoursesPage} />
          <Route path="/course/:id" exact component={CoursePage} />
          <Route
            path="/course/:courseId/lesson/:lessonId"
            exact
            component={LessonPage}
          />
          <Route
            path="/course/:courseId/lesson/:lessonId/task/:taskId"
            exact
            component={TaskPage}
          />
        </Layout>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;

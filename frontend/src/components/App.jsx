import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { ChakraProvider} from '@chakra-ui/react';

import Layout from './Layout';

import CoursesPage from '../pages/courses';
import CoursePage from '../pages/course';
import LessonPage from '../pages/lesson';
import TaskPage from '../pages/task';
import RedirectPage from '../pages/redirect';
import Page404 from '../pages/page404';
import { Redirect } from 'react-router';

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route path="/" exact component={CoursesPage} />
            <Route path="/redirect" component={RedirectPage} />
            <Route
              path="/group/:groupId/course/:courseId"
              exact
              component={CoursePage}
            />
            <Route
              path="/group/:groupId/course/:courseId/lesson/:lessonId"
              exact
              component={LessonPage}
            />
            <Route
              path="/course/:courseId/lesson/:lessonId/task/:taskId"
              exact
              component={TaskPage}
            />
            <Route component={Page404} />
          </Switch>
        </Layout>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;

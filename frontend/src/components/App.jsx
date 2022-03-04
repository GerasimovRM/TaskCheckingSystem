import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';

import Layout from './Layout';

import CoursesPage from '../pages/courses';
import CoursePage from '../pages/course';
import LessonPage from '../pages/lesson';
import TaskPage from '../pages/task';
import RedirectPage from '../pages/redirect';
import Page404 from '../pages/page404';
import SettingsPage from '../pages/settings';
import BreadcrumbGenerator from './BreadcrumbGenerator';
import PrivateRoute from './PrivateRoute';
import NoAuthPage from '../pages/noauth';

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Layout>
          <BreadcrumbGenerator />
          <Switch>
            <PrivateRoute path="/" exact component={CoursesPage} />
            <Route path="/redirect" component={RedirectPage} />
            <PrivateRoute
              path="/group/:groupId/course/:courseId"
              exact
              component={CoursePage}
            />
            <PrivateRoute
              path="/group/:groupId/course/:courseId/lesson/:lessonId"
              exact
              component={LessonPage}
            />
            <PrivateRoute
              path="/course/:courseId/lesson/:lessonId/task/:taskId"
              exact
              component={TaskPage}
            />
            <PrivateRoute path="/settings" exact component={SettingsPage} />
            <Route path="/noauth" component={NoAuthPage} />
            <PrivateRoute component={Page404} />
          </Switch>
        </Layout>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;

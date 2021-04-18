import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import 'antd/dist/antd.css';
import Layout from './Layout';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </div>
  );
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'focus-visible/dist/focus-visible';
import { RootStoreContext } from './context';
import { RootStore } from './store/RootStore';

ReactDOM.render(
    <React.StrictMode>
        <RootStoreContext.Provider value={new RootStore()}>
            <App/>
        </RootStoreContext.Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
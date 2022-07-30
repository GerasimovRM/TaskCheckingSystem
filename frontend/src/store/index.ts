import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from 'redux-thunk';
import reducers from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

const rootReducer = combineReducers(reducers)

export const store = createStore(rootReducer, composeWithDevTools({trace: true})(applyMiddleware(thunk)))


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
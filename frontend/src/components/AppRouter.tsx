import React, {useContext} from 'react';
import { observer } from "mobx-react-lite"
import {
    Routes,
    Route,
} from "react-router-dom";
import {privateRoutes, publicRoutes} from "../routes";
import { RootStoreContext } from '../context';

const AppRouter = observer(() => {
    const RS = useContext(RootStoreContext);
    const isAuth = RS.authStore.isAuth;
    return (
        isAuth
            ?
            <Routes>
                {privateRoutes.map(route => <Route {...route}/>)}
            </Routes>
            :
            <Routes>
                {publicRoutes.map(route => <Route {...route} />)}
            </Routes>
    );
});

export default AppRouter;
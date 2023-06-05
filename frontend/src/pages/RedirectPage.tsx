import { observer } from 'mobx-react-lite';
import React, {useContext, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {BaseSpinner} from "../components/BaseSpinner";
import { RootStoreContext } from '../context';

const RedirectPage = observer(() => {
    const RS = useContext(RootStoreContext);
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const code: string = params.get('code')!;
    useEffect(() => {
        RS.authStore.vkLogin(code);
        setTimeout(() => navigate("/"), 1000)
    }, [])
    return <BaseSpinner />;
})

export default RedirectPage;
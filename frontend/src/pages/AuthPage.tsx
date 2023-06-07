import { observer } from 'mobx-react-lite';
import React, { Suspense } from 'react'
import { useNavigate } from 'react-router-dom';
import AuthError from '../components/AuthError';
import { RootStoreContext } from '../context';
import { IAuthPageProps } from '../models/IAuthPageProps';
import ILoginData from '../models/ILoginData';
import {baseSiteURL, vkClientId} from "../api/api";

// @ts-ignore
const AuthRemote = React.lazy(() => import('auth/App'));

const AuthPage = observer(() => {
    const RS = React.useContext(RootStoreContext);
    const { error } = RS.authStore;
    const navigate = useNavigate();
    const funcs: IAuthPageProps = {
        signIn: (args: ILoginData) => {
            RS.authStore.login(args).then(status => status && navigate('/'));
        },
        signUp: (args: ILoginData) => {
            RS.authStore.signUp(args).then(status => status && navigate('/'));
        },
        vkLogin: `https://oauth.vk.com/authorize?client_id=${vkClientId}&redirect_uri=${baseSiteURL}/redirect&display=page&scope=offline&response_type=code&v=5.131`
    }
return (
    <div>
        {error && <AuthError error={error}/>}
        <Suspense fallback={<div>Загрузка</div>}>
            <AuthRemote {...funcs}></AuthRemote>
        </Suspense>
    </div>
)
});

export default AuthPage
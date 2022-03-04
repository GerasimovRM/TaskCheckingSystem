import React, {useEffect} from 'react';
import { Spinner } from '@chakra-ui/react';
import {useActions} from "../hooks/useActions";
import {useNavigate} from "react-router-dom";

export default function RedirectPage() {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const code: string = params.get('code')!;
    const {login} = useActions()
    useEffect(() => {
        login(code);
        navigate("/")
    })
    return <Spinner />;
}
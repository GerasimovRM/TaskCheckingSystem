import React, {useEffect} from 'react';
import {useActions} from "../hooks/useActions";
import {useNavigate} from "react-router-dom";
import {BaseSpinner} from "../components/BaseSpinner";

export default function RedirectPage() {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const code: string = params.get('code')!;
    const {login} = useActions()
    useEffect(() => {
        login(code);
        setTimeout(() => navigate("/"), 1000)
    }, [])
    return <BaseSpinner />;
}
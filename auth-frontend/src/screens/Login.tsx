import React, { useState } from "react";
import { Button, Container, Divider, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, Spacer, Icon } from "@chakra-ui/react";
import { AuthState } from "../models/AuthState";
import { FaVk } from "react-icons/fa"

import './Login.css'

interface Props {
    setState: Function,
    signIn: Function,
    vkLogin: string,
}

const Login = (props: Props) => {
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [isLoginError, setIsLoginError] = useState<boolean>(false);
    const [isPasswordError, setIsPasswordError] = useState<boolean>(false);

    const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoginError(login === '' ? true : false);
        setIsPasswordError(password === '' ? true : false);
        if (login !== '' && password !== '') {
            props.signIn({login: login, password: password});
        }
    }

    return (
        <Container className="Auth">
            <Heading>Войти</Heading>
            <br/>
            <form onSubmit={(e) => handleForm(e)}>
                <FormControl isInvalid={isLoginError}>
                    <FormLabel>Логин</FormLabel>
                    <Input type='input' value={login} onChange={(e) => setLogin(e.target.value)} />
                </FormControl>
                <br/>
                <FormControl isInvalid={isPasswordError}>
                    <FormLabel>Пароль</FormLabel>
                    <Input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </FormControl>
                <br/>
                <Flex>
                    <Button type="submit">Войти</Button>
                    <Spacer/>
                    <Button onClick={(e) => {props.setState(AuthState.SIGNUP)}}>Регистрация</Button>
                </Flex>
            </form>
            <Divider className="dvider"/>
            <a href={props.vkLogin}>
                <Button><Icon as={FaVk}></Icon></Button>
            </a>
        </Container>
    )
}

export default Login;
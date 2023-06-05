import { Button, Container, Flex, FormControl, FormLabel, Heading, Input, Spacer, FormErrorMessage } from '@chakra-ui/react';
import React, { useState } from 'react'
import { AuthState } from '../models/AuthState';

interface Props {
    setState: Function,
    signUp: Function,
}

const Registration = (props: Props) => {
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [password2, setPassword2] = useState<string>('');

    const [isLoginError, setIsLoginError] = useState<boolean>(false);
    const [isPasswordError, setIsPasswordError] = useState<boolean>(false);
    const [isPassword2Error, setIsPassword2Error] = useState<boolean>(false);

    const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== password2) {
            setIsPasswordError(true);
            setIsPassword2Error(true);
        } else {
            setIsPasswordError(false);
            setIsPassword2Error(false);
        }
        if (login === '') {
            setIsLoginError(true);
        } else {
            setIsLoginError(false);
        }
        if (password === '') {
            setIsPasswordError(true);
        } else {
            setIsPasswordError(false);
        }
        if (login !== '' && password !== '' && password === password2) {
            props.signUp({login: login, password: password});
        }
    }

    return (
        <Container className="Auth">
            <Heading>Регистрация</Heading>
            <br/>
            <form onSubmit={(e) => {handleForm(e)}}>
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
                <FormControl isInvalid={isPassword2Error}>
                    <FormLabel>Повторите пароль</FormLabel>
                    <Input type='password' value={password2} onChange={(e) => setPassword2(e.target.value)}/>
                    <FormErrorMessage>
                        Пароли не совпадают
                    </FormErrorMessage>
                </FormControl>
                <br/>
                <Flex>
                    <Button type="submit">Регистрация</Button>
                    <Spacer/>
                    <Button onClick={(e) => {props.setState(AuthState.SIGNIN)}}>Войти</Button>
                </Flex>
            </form>
        </Container>
    )
}

export default Registration
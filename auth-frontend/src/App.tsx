// @ts-ignore
import React, { useState } from "react";
import { AuthState } from './models/AuthState';
import Login from "./screens/Login";
import Registration from "./screens/Registration";

interface Props {
    signIn: Function,
    signUp: Function,
    vkLogin: string,
}

const App = (props: Props) => {
    const [state, setState] = useState<AuthState>(AuthState.SIGNIN);
    switch (state) {
        case AuthState.SIGNIN:
            return (
                <Login signIn={props.signIn} vkLogin={props.vkLogin} setState={setState}></Login>
            )
        case AuthState.SIGNUP:
            return (
                <Registration signUp={props.signUp} setState={setState}></Registration>
            )
        default:
            break;
    }
};

export default App;
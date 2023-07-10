import {Field, FieldInputProps, Form, Formik, FormikProps} from "formik";
import {
    Button,
    FormControl,
    FormLabel, NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper
} from "@chakra-ui/react";
import React, {useEffect, useRef, useState} from "react";

// @ts-ignore
export const TestPage = () => {
    const ws = useRef<WebSocket>()
    const [messages, setMessages] = useState<string[]>([]);
    useEffect(()=> {
        ws.current = new WebSocket("ws://localhost:5500/solution/15/2/2/2")
        ws.current.onmessage = function (event) {
            setMessages(msg => [...msg, event.data.toString()])
            // sendMessage(event)
        }
        ws.current.onclose = function (event) {

        }
        const wsCurrent = ws.current

        return () => {
            wsCurrent.close()
        }
    }, [])
    // @ts-ignore
    function sendMessage(event) {
        var input = document.getElementById("messageText")
        // @ts-ignore
        ws.current.send(input.value)
        // @ts-ignore
        input.value = ''
        event.preventDefault()
    }
    return (
        <div>
            <h1>WebSocket Chat</h1>
            <form action="">
                <input type="text" id="messageText" autoComplete="off"/>
                <button onClick={sendMessage}>Send</button>
            </form>
            {messages.map((message) => {
                return <p>{message}</p>
            })}
        </div>
    )
}
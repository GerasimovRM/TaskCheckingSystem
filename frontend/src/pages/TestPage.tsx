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
    const [wsNeedClose, setWsNeedClose] = useState<boolean>(false)
    useEffect(()=> {
        ws.current = new WebSocket("ws://localhost:5500/chat/ws")
    }, [])
    useEffect(() => {
        if (ws.current) {
            ws.current.onmessage = function (event) {
                setMessages(msg => [...msg, event.data.toString()])
                sendMessage(event)
            }
            ws.current.onopen = function (event) {
                sendMessage(event)
            }
            ws.current.onclose = function (event) {
                console.log('close!!!')
            }
        }
        return () => {
            console.log(ws.current, 'im closing!')
            ws.current?.close()
        }
    }, [ws])
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
import { Alert, AlertIcon, Container } from '@chakra-ui/react'
import React from 'react'

interface Props {
    error: string
}

const AuthError = (props: Props) => {
  return (
    <Container>
        <Alert status='error'>
            <AlertIcon/>
            {props.error}
        </Alert>
    </Container>
  )
}

export default AuthError
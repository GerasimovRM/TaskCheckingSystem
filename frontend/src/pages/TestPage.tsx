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
import React, {useState} from "react";

// @ts-ignore
export const TestPage = ({}) => {
    const score = 70
    const maxScore = 100
    //onCancel
    //onClose
    return (
        <Formik enableReinitialize={true} initialValues={{score: score}} onSubmit={(values, actions) => {
            if (values.score > maxScore)
                alert(maxScore)
            else if (values.score < 0)
                alert(0)
            else
                alert(values.score)
            actions.setSubmitting(false)
        }}>
            {(props) => (
            <Form>
                <Field name='score'>
                    {({ field, form }: { field: FieldInputProps<string>, form: FormikProps<{ score: number}> })  => (
                        <FormControl id={field.name}>
                            <FormLabel htmlFor={field.name}>Оценка</FormLabel>
                            <NumberInput
                                id={field.name}
                                {...field}
                                onChange={(val) => {
                                    form.setFieldValue(field.name, val)
                                }}
                                max={maxScore}
                                min={0}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                    )}
                </Field>
                <Button
                    mt={4}
                    colorScheme='teal'
                    isLoading={props.isSubmitting}
                    type='submit'
                >
                    Submit
                </Button>
            </Form>
            )}
        </Formik>
    )
}
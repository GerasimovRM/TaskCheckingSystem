import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { Button, Center } from '@chakra-ui/react';

import { login } from '../api/auth';
import PasswordInput from './PasswordInput';

export default function CreateAccountForm({ code }) {
  const formik = useFormik({
    initialValues: {
      password: '',
      passwordAgain: '',
    },
    validate: ({ password, passwordAgain }) => {
      const errors = {};
      if (!password) {
        errors.password = 'Обязательно';
      } else if (password.trim().length <= 5) {
        errors.password = 'Пароль должен быть длинее 5 символов';
      }

      if (passwordAgain !== password) {
        errors.passwordAgain = 'Пароли должны совпадать';
      }
      return errors;
    },
    onSubmit: async ({ password }, { setSubmitting }) => {
      setSubmitting(true);
      const result = await login(code, password);
      if (result.status) {
        window.location.href = '/';
      }
      setSubmitting(false);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <PasswordInput
        onChange={formik.handleChange}
        name="password"
        value={formik.values.password}
        text="Пароль"
        error={formik.errors.password}
      />
      <br />
      <PasswordInput
        onChange={formik.handleChange}
        name="passwordAgain"
        value={formik.values.passwordAgain}
        text="Повторите пароль"
        placeholder="Повторите пароль, введённый вами выше"
        error={formik.errors.passwordAgain}
      />
      <br />
      <Center>
        <Button colorScheme="teal" onClick={formik.submitForm}>
          Создать аккаунт
        </Button>
      </Center>
    </form>
  );
}

CreateAccountForm.propTypes = {
  code: PropTypes.string.isRequired,
};

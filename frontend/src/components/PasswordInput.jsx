import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  FormHelperText,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/all';

export default function PasswordInput({
  name,
  placeholder,
  text,
  value,
  onChange,
  error,
}) {
  const [show, setShow] = useState(false);
  return (
    <FormControl>
      <FormLabel>{text}</FormLabel>
      <InputGroup size="md">
        <Input
          name={name}
          pr="4.5rem"
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          isInvalid={error}
        />
        <InputRightElement>
          <IconButton
            h="1.75rem"
            size="sm"
            aria-label="Показать"
            icon={show ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            onClick={() => setShow(!show)}
          />
        </InputRightElement>
      </InputGroup>
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
}

PasswordInput.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  text: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

PasswordInput.defaultProps = {
  placeholder: 'Пароль должен быть длинее 5 символов',
  text: 'Пароль',
};

import React, { useState, useEffect } from 'react';
import { Spinner } from '@chakra-ui/react';

import { login } from '../api/auth';
import CreateAccountForm from '../components/CreateAccountForm';

export default function RedirectPage() {
  const [needPassword, setNeedPassword] = useState(null);
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  if (!code) {
    window.location.href = '/';
  }

  useEffect(() => {
    (async () => {
      const result = await login(code);
      if (
        !result.status &&
        result.detail === 'Password is required field for new user'
      ) {
        setNeedPassword(true);
      } else {
        window.location.href = '/';
      }
    })();
  }, []);

  if (needPassword === null) {
    return <Spinner />;
  }
  if (needPassword) {
    return <CreateAccountForm code={code} />;
  }
}

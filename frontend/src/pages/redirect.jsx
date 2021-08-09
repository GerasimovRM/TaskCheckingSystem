import React, { useEffect } from 'react';

export default function Redirect() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  useEffect(() => {
    (async () => {
      // вызов к api на этом месте
      window.location.href = '/';
    })();
  });
  return <div />; // spinner будет
}

import React, { useState } from 'react';
import { LoginWarning } from './loginWarning';
import { useLogin } from './loginContext';


export function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const { isLoggedIn } = useLogin();

  const handleLogin = () => {
    localStorage.setItem('userName', userName);
    localStorage.setItem('password', password);
    login();
  }

  return (
    <main className='main'>
        {!isLoggedIn && <LoginWarning />}
        <form className='login-form'>
            <input type="text" placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" onClick={handleLogin}>Login/Sign Up</button>
        </form>
    </main>
  );
}
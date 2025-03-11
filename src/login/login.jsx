import React, { useState, useEffect } from 'react';
import { LoginWarning } from './loginWarning';


export function Login({token, setToken, displayName, setDisplayName, setFiles, files}) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const storedDisplayName = localStorage.getItem('displayName');
    if (storedDisplayName) {
      setDisplayName(storedDisplayName);
    }
    
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (userName && password) {
      const response = await fetch('api/login', {
        method: 'post',
        body: JSON.stringify({ userName: userName, password: password }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const data = await response.json();
      const user = data.user;
      setDisplayName(user.displayName);
      setToken(user.token);
      setUserName(user.userName);
      setPassword(user.password);
      setFiles(user.files);
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (userName && password) {
      const response = await fetch('api/login', {
        method: 'put',
        body: JSON.stringify({ userName: userName, password: password }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const data = await response.json();
      const user = data.user;
      setDisplayName(user.displayName);
      setToken(user.token);
      setUserName(user.userName);
      setPassword(user.password);
      setFiles(user.files);
      console.log(files);
    }
  }


  const handleLogout = () => {
    setDisplayName('');
    setToken('');
    setUserName('');
    setPassword('');
  }


  return (
    <main className='main'>
      {!token && (
        <>
          <LoginWarning />
          <form className='login-form'>
            <input type="text" placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" onClick={handleLogin}>Login</button>
            <button type="button" onClick={handleSignUp}>Sign Up</button>
          </form>
        </>
      )}
      {token && (
        <div className='login-status'>
          <p>Logged in as {displayName}! Welcome back!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </main>
  );
}
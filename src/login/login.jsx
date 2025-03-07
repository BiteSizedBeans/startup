import React, { useState, useEffect } from 'react';
import { LoginWarning } from './loginWarning';


export function Login({isLoggedIn, setIsLoggedIn}) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const storedDisplayName = localStorage.getItem('displayName');
    if (storedDisplayName) {
      setDisplayName(storedDisplayName);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (userName && password) {
      localStorage.setItem('userName', userName);
      localStorage.setItem('password', password);
      localStorage.setItem('displayName', userName);
      setDisplayName(userName);
      setIsLoggedIn(true);
      setUserName('');
      setPassword('');
    } else {
      alert('Please enter a valid username and password');
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    setDisplayName('');
    localStorage.removeItem('displayName');
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (userName && password) {
      const response = await fetch('api/signup', {
        method: 'post',
        body: JSON.stringify({ userName: userName, password: password }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const data = await response.json();
      if (data.status === 'success') {
        localStorage.setItem('userName', userName);
        localStorage.setItem('password', password);
        localStorage.setItem('displayName', userName);
        setDisplayName(userName);
        setIsLoggedIn(true);
      }
    }
  }

  return (
    <main className='main'>
      {!isLoggedIn && (
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
      {isLoggedIn && (
        <div className='login-status'>
          <p>Logged in as {displayName}! Welcome back!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </main>
  );
}
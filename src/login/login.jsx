import React, { useState, useEffect } from 'react';
import { LoginWarning } from './loginWarning';
import { useLogin } from './loginContext';


export function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const { isLoggedIn, setIsLoggedIn } = useLogin();

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

  return (
    <main className='main'>
      {!isLoggedIn && (
        <>
          <LoginWarning />
          <form className='login-form'>
            <input type="text" placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" onClick={handleLogin}>Login / Sign Up</button>
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
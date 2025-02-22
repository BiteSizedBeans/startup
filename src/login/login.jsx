import React, { useState } from 'react';

export function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    localStorage.setItem('userName', userName);
    localStorage.setItem('password', password);
    setIsLoggedIn(true);
  }

  return (
    <main className='main'>
        {!isLoggedIn && (
          <div className='login-warning'>
            <p>Uploaded files, chat history, and transcripts will not be saved without logging in.</p>
          </div>
        )
          
        }
        <form className='login-form'>
            <input type="text" placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" onClick={handleLogin}>Login/Sign Up</button>
        </form>
    </main>
  );
}
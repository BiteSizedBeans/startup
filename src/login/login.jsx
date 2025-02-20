import React from 'react';

export function Login() {
  localStorage.setItem('userName', 'Thomas');
  const userName = localStorage.getItem('userName');

  return (
    <main className='main'>
        <form className='login-form'>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button type="submit">Login/Sign Up</button>
        </form>
    </main>
  );
}
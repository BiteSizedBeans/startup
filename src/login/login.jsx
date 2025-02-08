import React from 'react';

export function Login() {
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
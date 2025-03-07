import React from 'react';
import { NavLink } from 'react-router-dom';
import { Upload } from './upload';
import { LoginWarning } from '../login/loginWarning';

export function Library({isLoggedIn, files, setFiles, setCurrentFile}) {
  return (
    <main className='main-lib'>
      {!isLoggedIn && <LoginWarning />}
        <ul>
          {files.length === 0 && <p>No uploaded files... yet</p>}
          {files.map((file, index) => (
            <li key={index}>
              <NavLink className='nav-link' to='/' onClick={() => setCurrentFile(file)}>{file.name}</NavLink>
            </li>
          ))}
        </ul>
        <Upload setFiles={setFiles} />
    </main>
  );
}
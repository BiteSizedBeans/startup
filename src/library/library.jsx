import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Upload } from './upload';
import { FileContext } from './files';
import { LoginWarning } from '../login/loginWarning';
import { useLogin } from '../login/loginContext';

export function Library() {
  const { files, setCurrentFile } = useContext(FileContext);
  const { isLoggedIn } = useLogin();
  return (
    <main className='main-lib'>
      {!isLoggedIn && <LoginWarning />}
        <ul>
            {files.map((file, index) => (
                <li key={index}>
                    <NavLink className='nav-link' to='/' onClick={() => setCurrentFile(file)}>{file.name}</NavLink>
                </li>
            ))}
        </ul>
        <Upload />
    </main>
  );
}
import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Upload } from './upload';
import { FileContext } from './files';

export function Library() {
  const { files, setCurrentFile } = useContext(FileContext);

  return (
    <main className='main-lib'>
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
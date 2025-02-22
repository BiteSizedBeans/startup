import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Upload } from './upload';
import { FileContext } from './files';

export function Library() {
  const { files } = useContext(FileContext);

  return (
    <main className='main-lib'>
        <ul>
            {files.map((file, index) => (
                <li key={index}>
                    <NavLink className='nav-link' to='/'>{file}</NavLink>
                </li>
            ))}
        </ul>
        <Upload />
    </main>
  );
}
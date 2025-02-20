import React from 'react';
import { NavLink } from 'react-router-dom';
export function Library() {
  return (
    <main className='main-lib'>
        <ul>
            <li><NavLink className='nav-link' to='/'>File1.mp3</NavLink></li>
            <li><NavLink className='nav-link' to='/'>File2.mp3</NavLink></li>
            <li><NavLink className='nav-link' to='/'>File3.mp3</NavLink></li>
            <li><NavLink className='nav-link' to='/'>File4.mp3</NavLink></li>
            <li><NavLink className='nav-link' to='/'>File5.mp3</NavLink></li>
        </ul>
        <button type="submit">Upload New File</button>
    </main>
  );
}
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Library } from './library/library';
import { Login } from './login/login';
import { Home } from './home/home';
import { useState } from 'react';

export default function App() {
  const [files, setFiles] = useState(["public/Default_File.MP3"]);
  const [currentFile, setCurrentFile] = useState(files[0]);
  const [token, setToken] = useState('');
  const [displayName, setDisplayName] = useState('');

  return (
    <BrowserRouter>
      <div>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Lexend+Tera:wght@100..900&display=swap');
        </style>
        <header>
          <div className="text-container">
            <h1>Talk Back</h1>
            <nav>
              <menu>
                <p>
                  <NavLink className='nav-link active' to=''>Home |</NavLink> 
                  <NavLink className='nav-link' to='library'>Library |</NavLink> 
                  <NavLink className='nav-link' to='login'>Login</NavLink></p>
              </menu>
            </nav>
          </div>
          <img src="TalkBackLogo.jpeg" alt="Talk Back Logo" width="100" height="100"></img>  
        </header>

        <Routes>
          <Route path='/' element={<Home currentFile={currentFile}/>} />
          <Route path='/library' element={<Library token={token} files={files} setFiles={setFiles} setCurrentFile={setCurrentFile} />} />
          <Route path='/login' element={<Login token={token} setToken={setToken} displayName={displayName} setDisplayName={setDisplayName} />} />
          <Route path='*' element={<NotFound />} />
        </Routes>

        <footer>
          <p>Thomas Bean</p>
          <p><a href="https://github.com/BiteSizedBeans/startup.git">Github</a></p>
        </footer>
      </div>
    </BrowserRouter>
  );
}
function NotFound() {
  return <div>404: Return to sender. Address unknown.</div>;
}
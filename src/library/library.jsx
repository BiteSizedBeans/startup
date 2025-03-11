import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Upload } from './upload';
import { LoginWarning } from '../login/loginWarning';

export function Library({token, files, setFiles, setCurrentFile}) {

  useEffect(() => {
    if (token) {
      fetch('/api/files', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(data => {
        setFiles(data.files);
        console.log(files);
      })
      .catch(error => console.error('Error fetching files:', error));
    } else {
      setFiles([]);
      setCurrentFile("public/Default_File.MP3");
    }
  }, [token, setFiles, setCurrentFile ]);

  return (
    <main className='main-lib'>
      {!token && <LoginWarning />}
        <ul>
          {files.length === 0 && <p>No uploaded files... yet</p>}
          {files.map((file, index) => (
            <li key={index}>
              <NavLink className='nav-link' to='/' onClick={() => setCurrentFile(file)}>{file.fileName}</NavLink>
            </li>
          ))}
        </ul>
        <Upload setFiles={setFiles} token={token} />
    </main>
  );
}
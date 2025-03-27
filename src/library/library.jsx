import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Upload } from './upload';
import { LoginWarning } from '../login/loginWarning';
import { Notifications } from './notifications';

export function Library({token, files, setFiles, setCurrentFile, useGuestData, guestFiles, setMessageHistory}) {
  const [transcribing, setTranscribing] = useState(false);

  function selectFile(file) {
    setCurrentFile(file);
    setMessageHistory(file.fileChatHistory);
  }

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
      })
      .catch(error => console.error('Error fetching files:', error));
    } else {
      fetch('/api/files', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer guest`
        }
      })
      .then(response => response.json())
      .then(data => {
        setFiles(data.files);
      })
      .catch(error => console.error('Error fetching files:', error));
    }
  }, [token, setFiles, setCurrentFile, useGuestData, guestFiles]);

  return (
    <main className='main-lib'>
      {!token && <LoginWarning />}
      <div className='library-container'>
        <ul>
          {files.length === 0 && <p>No uploaded files... yet</p>}
          {files.map((file, index) => (
            <li key={index}>
              <NavLink className='nav-link' to='/' onClick={() => selectFile(file)}>{file.fileName}</NavLink>
            </li>
          ))}
          {transcribing && <p>Transcribing File...</p>}
        </ul>
        <Upload setFiles={setFiles} token={token} useGuestData={useGuestData} guestFiles={guestFiles} setTranscribing={setTranscribing}/>
      </div>
      <div className='notifications-container'>
        <Notifications token={token} />
      </div>
    </main>
  );
}
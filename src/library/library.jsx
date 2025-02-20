import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Upload } from './upload';

export function Library() {
  const [files, setFiles] = useState(['File1.mp3', 'File2.mp3', 'File3.mp3', 'File4.mp3', 'File5.mp3']);

  useEffect(() => {
    const file = localStorage.getItem('file');
    if (file) {
      setFiles([...files, file]);
    }
  }, []);

  const handleFileUpload = (file) => {
    setFiles([...files, file]);
  };

  return (
    <main className='main-lib'>
        <ul>
            {files.map((file, index) => (
                <li key={index}>
                    <NavLink className='nav-link' to='/' file={file}>{file}</NavLink>
                </li>
            ))}
        </ul>
        <Upload onFileUpload={handleFileUpload} />
    </main>
  );
}
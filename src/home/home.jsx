import React, { useState, useContext, useRef, useEffect } from 'react';
import { Response } from './response';
import { SubmitQuestion } from './submitQuestion';
import { LoginWarning } from '../login/loginWarning';

export function Home({currentFile, token, files}) {
  const [history, setResponse] = useState([]);
  const [question, setQuestion] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);
  const [playCurrentFile, setPlayCurrentFile] = useState(false);

  const toggleTranscript = () => {
    if (currentFile) {
      setShowTranscript(!showTranscript);
    }
  }

  const togglePlayCurrentFile = () => {
    if (currentFile) {
      setPlayCurrentFile(!playCurrentFile);
    }
  }

  return (
    <main className='main'>
      {!token && <LoginWarning />}
        <menu>
          <button type="button" value="Play Current File" 
          onClick={(e) => {
            e.preventDefault();
            togglePlayCurrentFile();
          }}>Play Current File</button>
          <button type="button" value="View Transcript" 
          onClick={(e) => {
            e.preventDefault();
            toggleTranscript();
          }}>View Transcript</button>
        </menu>
        {!currentFile && <p className='no-file-selected'>~ No file selected ~</p>}
        {playCurrentFile && (
          <div>
            <p>{currentFile.fileName || 'Default File'}</p>
            <audio src={`/api/audio/${currentFile.file.filename}${currentFile.file.originalname.substring(currentFile.file.originalname.lastIndexOf('.'))}`} controls />
          </div>
        )}
        {showTranscript && (
          <p>{currentFile.fileTranscript}</p>
        )}
        <div className="chat-container">
          <div className="chat-history">
            <Response history={history} prompt={question} setResponse={setResponse} setQuestion={setQuestion} currentFile={currentFile} token={token} files={files}/>
          </div>
          <div className="chat-form">
            <SubmitQuestion setQuestion={setQuestion} setResponse={setResponse} history={history} token={token}/>
          </div>
        </div>
    </main>


  );
}

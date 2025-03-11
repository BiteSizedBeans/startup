import React, { useState, useContext, useRef, useEffect } from 'react';
import { Response } from './response';
import { SubmitQuestion } from './submitQuestion';

export function Home({currentFile, token, files}) {
  const [history, setResponse] = useState([]);
  const [question, setQuestion] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);
  const [playCurrentFile, setPlayCurrentFile] = useState(false);

  const toggleTranscript = () => {
    setShowTranscript(!showTranscript);
  }

  const togglePlayCurrentFile = () => {
    setPlayCurrentFile(!playCurrentFile);
  }

  const audioSrc = typeof currentFile === 'string' 
    ? currentFile
    : currentFile instanceof File
      ? URL.createObjectURL(currentFile)
      : '';

  return (
    <main className='main'>
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
        {playCurrentFile && (
          <div>
            <p>{currentFile.name || 'Default File'}</p>
            <audio src={audioSrc} controls />
          </div>
        )}
        {showTranscript && (
          <p>This is where the Transcript will go</p>
        )}
        <div className="chat-container">
          <div className="chat-history">
            <Response history={history} prompt={question} setResponse={setResponse} setQuestion={setQuestion} currentFile={currentFile} token={token} files={files}/>
          </div>
          <div className="chat-form">
            <SubmitQuestion setQuestion={setQuestion} setResponse={setResponse} history={history} currentFile={currentFile}/>
          </div>
        </div>
    </main>


  );
}

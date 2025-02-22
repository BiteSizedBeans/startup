import React, { useState, useContext, useRef, useEffect } from 'react';
import { Response } from './response';
import { SubmitQuestion } from './submitQuestion';
import { FileContext } from '../library/files';

export function Home() {
  const { currentFile } = useContext(FileContext);
  const [response, setResponse] = useState('');
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
            <audio ref={audioRef} controls />
          </div>
        )}
        {showTranscript && (
          <p>This is where the Transcript will go</p>
        )}
        <chat>
          <history>
            <Response response={response} question={question} setResponse={setResponse} setQuestion={setQuestion} />
          </history>
          <form className="chat-form">
            <SubmitQuestion question={question} setQuestion={setQuestion} />
          </form>
        </chat>
    </main>


  );
}

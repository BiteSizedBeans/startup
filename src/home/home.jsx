import React, { useState } from 'react';
import { Response } from './response';
import { SubmitQuestion } from './submitQuestion';
export function Home() {
  const [response, setResponse] = useState('');
  const [question, setQuestion] = useState('');
  return (
    <main className='main'>
        <menu>
          <button type="button" value="|Play Current File|">Play Current File</button>
          <button type="button" value="|View Transcript|">View Transcript</button>
        </menu>
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

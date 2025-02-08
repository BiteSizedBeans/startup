import React from 'react';

export function Home() {
  return (
    <main className='main'>
        <menu>
          <button type="button" value="|Play Current File|">Play Current File</button>
          <button type="button" value="|View Transcript|">View Transcript</button>
        </menu>
        <chat>
          <history>
            <p tag="left">&gt; Conversation History</p>
            <p tag="right">Conversation History &lt;</p>
          </history>
          <form className="chat-form">
            <input className="chat-form-input" type="text" placeholder="Ask a Question..." id="input-field"></input>
          </form>
        </chat>
    </main>


  );
}

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';



export default function App() {
  return (
    <div>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Lexend+Tera:wght@100..900&display=swap');
      </style>
      <header>
        <div className="text-container">
          <h1>Talk Back</h1>
          <nav>

            <menu>
              <p><a href="index.html">Home</a> | <a href="library.html">Library</a> | <a href="login.html">Log in</a></p>
            </menu>
          </nav>
        </div>
        <img src="TalkBackLogo.jpeg" alt="Talk Back Logo" width="100" height="100"></img>  
      </header>
      <main>
        <menu>
          <button type="button" value="|Play Current File|">Play Current File</button>
          <button type="button" value="|View Transcript|">View Transcript</button>
        </menu>
        <chat>
          <history>
            <p tag="left">&gt; Conversation History</p>
            <p tag="right">Conversation History &lt;</p>
          </history>
          <form id="input-form">

            <input type="text" placeholder="Ask a Question..." id="input-field"></input>
          </form>
        </chat>
      </main>
      <footer>
        <p>Thomas Bean</p>
        <p><a href="https://github.com/BiteSizedBeans/startup.git">Github</a></p>
      </footer>
    </div>
  );
}
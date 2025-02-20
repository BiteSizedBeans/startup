import React, { useState } from 'react';

export function SubmitQuestion({question, setQuestion}) {
    return (
        <input className="chat-form-input" type="text" placeholder="Ask a Question..." id="input-field" onSubmit={setQuestion(question)}></input>
    );
}

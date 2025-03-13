import React, { useState } from 'react';

export function SubmitQuestion({setQuestion, setResponse, history, token}) {
    const [inputValue, setInputValue] = useState('');
    
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            if (!token) {
                alert('Must be logged in to submit a question');
                setInputValue('');
                return;
            }
            event.preventDefault();
            setQuestion(event.target.value);
            setInputValue('');
            setResponse(history + event.target.value + "\n");
        }
    }
    
    return (
        <input className="chat-form-input" 
        type="text" 
        placeholder="Ask a Question..." 
        id="input-field"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}></input>
    );
}

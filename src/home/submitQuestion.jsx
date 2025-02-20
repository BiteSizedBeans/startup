import React, { useState } from 'react';

export function SubmitQuestion({question, setQuestion}) {
    const [inputValue, setInputValue] = useState('');
    
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            setQuestion(event.target.value);
            setInputValue('');
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

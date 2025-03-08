import React, { useEffect, useState } from 'react';

export function Response({history, prompt, setResponse, setQuestion}) {
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getResponse() {
            if (!prompt) return;

            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] })
                });
                const data = await response.json();
                const message = data.message;
                console.log(message);
                setResult(message);
                setResponse(history + message+ "\n");
                setQuestion('');
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        getResponse();
    }, [prompt, history, setResponse, setQuestion]);

    return (
        <div className="chat-history">        
            {error && <p className="error">Error: {error}</p>}
            <div className="chat-messages">
                {history.split('\n').map((message, index) => {
                    const isUserMessage = index % 2 === 0;
                    
                    return (
                        <div 
                            key={index} 
                            className={`message-container ${isUserMessage ? 'user-message' : 'ai-message'}`}
                        >
                            <div className={`message ${isUserMessage ? 'user' : 'ai'}`}>
                                {message.split('\n').map((line, i) => (
                                    <React.Fragment key={i}>
                                        {line}
                                        {i < message.split('\n').length - 1 && <br />}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            {loading && <p>Loading...</p>}
        </div>
    );
}

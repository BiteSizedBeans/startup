import React, { useEffect, useState } from 'react';

export function Response({prompt, setResponse, setQuestion, currentFile, token, messageHistory, setMessageHistory}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getResponse() {
            if (!currentFile) return;
            if (!token) return;
            if (!prompt) return;

            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: prompt, token: token, file: currentFile })
                });
                const data = await response.json();
                const chatHistory = data.chatHistory;
                setMessageHistory(chatHistory);
                setQuestion('');
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        getResponse();
    }, [prompt, messageHistory, setResponse, setQuestion]);

    return (
        <div className="chat-history">        
            {error && <p className="error">Error: {error}</p>}
            <div className="chat-messages">
                {messageHistory.slice(1).map((message, index) => {
                    const isUserMessage = index % 2 === 0;
                    
                    return (
                        <div 
                            key={index} 
                            className={`message-container ${isUserMessage ? 'user-message' : 'ai-message'}`}
                        >
                            <div className={`message ${isUserMessage ? 'user' : 'ai'}`}>
                                {message.content.split('\n').map((line, i) => (
                                    <React.Fragment key={i}>
                                        {line}
                                        {i < message.content.split('\n').length - 1 && <br />}
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

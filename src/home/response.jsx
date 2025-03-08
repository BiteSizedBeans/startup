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
                setResponse(history + message+ "\n\n");
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
        <div>        
            {error && <p className="error">Error: {error}</p>}
            <p dangerouslySetInnerHTML={{ __html: history.replace(/\n/g, '<br />') }}></p>
            {loading && <p>Loading...</p>}
        </div>
    );
}

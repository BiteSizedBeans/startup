import React, { useEffect, useState } from 'react';

export function Response({history, prompt, setResponse, setQuestion}) {
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    async function getResponse() {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] })
        });
        const data = await response.json();
        setResult(data.response);
        setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
            if (prompt) {
                const answer = getResponse();
                setResponse(history + answer);
                setQuestion('');
        }
    }, [prompt]);

    return (
        <div>
            <p dangerouslySetInnerHTML={{ __html: history.replace(/\n/g, '<br />') }}></p>
        </div>
    );
}

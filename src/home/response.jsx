import React, { useEffect } from 'react';

export function Response({history, question, setResponse, setQuestion}) {
    useEffect(() => {
            if (question) {
                fetch('/api/response', {
                    method: 'GET',
                })
                .then(response => response.text())
                .then(data => {
                    setResponse(history + data);
                });
                setQuestion('');
        }
    }, [question]);
    return (
        <div>
            <p dangerouslySetInnerHTML={{ __html: history.replace(/\n/g, '<br />') }}></p>
        </div>
    );
}

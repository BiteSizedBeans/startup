import React, { useEffect } from 'react';

export function Response({response, question, setResponse, setQuestion}) {
    useEffect(() => {
        if (question) {
            setResponse(response + 'This is an example response\n');
            setQuestion('');
        }
    }, [question]);
    return (
        <div>
            <p dangerouslySetInnerHTML={{ __html: response.replace(/\n/g, '<br />') }}></p>
        </div>
    );
}

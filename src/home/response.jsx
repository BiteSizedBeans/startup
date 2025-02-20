import React, { useState } from 'react';

export function Response({response, question, setResponse}) {
if (question) {
    setResponse('This is an example response');
    return (
        <div>
                <p>{response}</p>
            </div>
        );
    } else {
        return (
            <div>
                <p></p>
            </div>
        );
    }
}

import React from "react";

export function Upload({setFiles, user}) {

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'audio/mpeg') {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: JSON.stringify({ file: file.name, user: user }),
            });
            setFiles(prevFiles => [...prevFiles, file]);
        } else {
            alert('Please upload a valid audio file');
        }
    };
    return (
        <div className="upload-container">
            <input type="file" id="file-upload" className="file-input" onChange={handleFileUpload}/>
            <label htmlFor="file-upload" className="upload-button" >
                Upload File
            </label>
        </div>
    );
}
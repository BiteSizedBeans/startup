import React from "react";

export function Upload({setFiles, token}) {

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'audio/mpeg') {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('token', token);
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            console.log(data);
            setFiles(prevFiles => [...prevFiles, file]);
        } else {
            alert('upload failed');
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
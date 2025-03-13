import React from "react";

export function Upload({setFiles, token}) {

    const handleFileUpload = async (event) => {
        if (token){
            const file = event.target.files[0];
            if (file && (file.type === 'audio/mpeg' || file.type === 'audio/x-m4a')) {
                
                const fileData = new FormData();
                fileData.append('file', file);
                fileData.append('token', token);
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: fileData,
                });
                const data = await response.json();
                if (data.error){
                    alert(data.error);
                    return;
                }
                fetch('/api/files', {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => response.json())
                .then(data => {
                    setFiles(data.files);
                })
                const fileDataNew = new FormData();
                fileDataNew.append('file', data.file);
            } else {
                alert('upload failed');
            }
        } else {
            alert('Must be logged in to upload files');
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
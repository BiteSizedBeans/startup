import React, { useState } from "react";
export function Upload() {

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            localStorage.setItem('file', file.name);
        }
    };

    return (
        <div className="upload-container">
            <input type="file" id="file-upload" className="file-input" onSubmit={handleFileUpload}/>
            <label htmlFor="file-upload" className="upload-button" >
                Upload File
            </label>
        </div>
    );
}
import React, { useState, useContext } from "react";
import { FileContext } from "./files";

export function Upload() {
    const { files, setFiles } = useContext(FileContext);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'audio/mpeg') {
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
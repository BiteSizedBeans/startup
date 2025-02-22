import React, { createContext, useState } from 'react';

export const FileContext = createContext();

export const FileProvider = ({ children }) => {
    const [files, setFiles] = useState([]);
    const [currentFile, setCurrentFile] = useState("public/Default_File.MP3");

    return (
        <FileContext.Provider value={{ files, setFiles, currentFile, setCurrentFile }}>
            {children}
        </FileContext.Provider>
    );
};

import React from 'react';

export function Library() {
  return (
    <main className='main-lib'>
        <ul>
            <li><a href="index.html">File1.mp3</a></li>
            <li><a href="index.html">File2.mp3</a></li>
            <li><a href="index.html">File3.mp3</a></li>
            <li><a href="index.html">File4.mp3</a></li>
            <li><a href="index.html">File5.mp3</a></li>
        </ul>
        <button type="submit">Upload New File</button>
    </main>
  );
}
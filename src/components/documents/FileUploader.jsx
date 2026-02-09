import React, { useRef, useState } from 'react';
import './FileUploader.css';

export default function FileUploader({ onFileSelect }) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files);
    }
  };
  
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div 
      className={`file-uploader ${dragActive ? "drag-active" : ""}`}
      onDragEnter={handleDrag} 
      onDragLeave={handleDrag} 
      onDragOver={handleDrag} 
      onDrop={handleDrop}
      onClick={onButtonClick}
    >
      <input 
        ref={inputRef} 
        type="file" 
        style={{display: "none"}} 
        multiple={false} 
        onChange={handleChange}
        accept=".pdf,.doc,.docx" // Updated file types
      />
      <div className="uploader-content">
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2.8-3.3-4.4-6-3.9-1.5.3-2.9 1.3-3.7 2.6-1.2-1.8-3.4-2.8-5.6-2.1-2.5.8-4.1 3.1-3.6 5.6.4 2.1 2.3 3.8 4.5 3.9h1.5m6-1.2v-7m-3 3 3-3 3 3"></path></svg>
        <p><strong>Drop files here or click to upload</strong></p>
        <p className="uploader-hint">Supports PDF, DOC, DOCX up to 100MB</p>
      </div>
    </div>
  );
}
import React, { useState, useRef, useEffect } from 'react';
// Import child components
import FileUploader from '../components/documents/FileUploader.jsx';
import AnalysisResultsCard from '../components/documents/AnalysisResultsCard.jsx';
import DocumentListItem from '../components/documents/DocumentListItem.jsx';
// Import page styles
import './DocIntelligencePage.css';

// --- MOCK DATA ---
const mockResults = {
    dealValue: '$50M',
    closingDate: 'March 15, 2025',
    keyRisks: ['3 regulatory approvals needed', 'Pending lawsuit (page 89)'],
};
const recentDocumentsMock = [
    { _id: '1', name: 'Q3_Financial_Report.pdf', size: '2.5', date: 'Oct 15, 2025', status: 'Processed' },
    { _id: '2', name: 'Annual_General_Meeting_Minutes.pdf', size: '1.1', date: 'Oct 12, 2025', status: 'Processed' },
    { _id: '3', name: 'Acquisition_Proposal_Project_Titan.pdf', size: '5.8', date: 'Oct 11, 2025', status: 'Pending' },
];

// --- MAIN PAGE COMPONENT ---
export default function DocIntelligencePage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [error, setError] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null); // Ref might be needed by FileUploader now
    const [recentDocuments, setRecentDocuments] = useState([]);

    // --- Fetch Recent Documents ---
     useEffect(() => {
        // TODO: Replace with fetch('/api/documents/recent') or similar
        setRecentDocuments(recentDocumentsMock);
     }, []);

    // --- FILE HANDLING LOGIC ---
    const handleFile = (files) => {
        const file = files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
            setAnalysisResults(null);
            setError('');
        } else {
            setSelectedFile(null);
            setError('Invalid file type. Please upload a PDF.');
        }
    };
     const handleDrag = (e) => {
        e.preventDefault(); e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };
     const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation(); setDragActive(false);
        if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files);
    };
     // Note: handleChange might not be needed if FileUploader handles its own input change
     // const handleChange = (e) => {
     //    e.preventDefault(); if (e.target.files?.[0]) handleFile(e.target.files);
     // };
     // const onUploadClick = () => inputRef.current.click();

    // --- SUBMIT LOGIC ---
    const handleSubmit = async () => {
        if (!selectedFile) return;
        setIsAnalyzing(true);
        setAnalysisResults(null);
        setError('');
        const formData = new FormData();
        formData.append('pdf', selectedFile);

        try {
            const response = await fetch('https://api-dealpulse.logicleap.in/api/upload', {
                method: 'POST',
                body: formData,
            });
            const responseBody = await response.text();
            if (!response.ok) {
                let errorData;
                try { errorData = JSON.parse(responseBody); }
                catch(e) { errorData = { message: responseBody || `Upload failed: ${response.status}` }; }
                throw new Error(errorData.message);
            }
            let data;
             try { data = JSON.parse(responseBody); }
             catch (e) { throw new Error("Invalid summary format from server."); }
            console.log("Summary received:", data);
            setAnalysisResults({
                executive_summary: data.summary_preview || "No summary preview.",
                details: data.details || {}
            });
        } catch (err) {
            console.error("Error uploading/summarizing:", err);
            setError(err.message || 'Processing error.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    // --- RENDER LOGIC FOR THE LEFT CARD ---
    const renderLeftCardContent = () => {
        if (analysisResults) {
             return <AnalysisResultsCard results={analysisResults} />;
        }
        if (selectedFile) {
            return (
                <div className="selected-file-view">
                    <p>Ready to Analyze:</p>
                    <div className="file-details">
                        <span className="file-icon">📄</span>
                        <div className="file-text">
                            <p className="file-name">{selectedFile.name}</p>
                            <p className="file-size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <button className="submit-analysis-btn" onClick={handleSubmit} disabled={isAnalyzing}>
                        {isAnalyzing ? 'Analyzing...' : 'Submit for Analysis'}
                    </button>
                    {error && <p className="error-message upload-error">{error}</p>}
                </div>
            );
        }
        // Pass necessary props/handlers to the actual FileUploader component
        // Ensure FileUploader component itself handles the input ref and click logic
        return (
             <FileUploader
                onFileSelect={handleFile} // Pass the handler function
                dragActive={dragActive} // Pass state for styling
                // Pass inputRef if FileUploader needs direct access to the hidden input
                // inputRef={inputRef} 
             />
        );
    };

    return (
        <div className="doc-intelligence-container">
            {/* --- LEFT COLUMN --- */}
            <div className="left-column">
                <div
                    className={`main-card ${dragActive ? "drag-active" : ""}`}
                    // Move drag handlers here if main card needs to respond
                    onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                >
                    {renderLeftCardContent()}
                </div>
                 {error && !selectedFile && !analysisResults && <p className="error-message">{error}</p>}
            </div>

            {/* --- RIGHT COLUMN --- */}
            <div className="right-column">
                <div className="recent-docs-section">
                    <h2 className="section-title">Recent Documents</h2>
                    <div className="doc-list">
                        {recentDocuments.map(doc => <DocumentListItem key={doc._id || doc.name} {...doc} />)}
                         {recentDocuments.length === 0 && <p>No recent documents.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
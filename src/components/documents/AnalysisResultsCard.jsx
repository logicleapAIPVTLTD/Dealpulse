import React, { useState } from 'react';
import './AnalysisResultsCard.css';

// This component now receives the summary object from the backend response
export default function AnalysisResultsCard({ results }) {
    // State to manage download button
    const [isDownloading, setIsDownloading] = useState(false);
    
    // Extract the main summary text
    const summaryText = results?.executive_summary || results?.summary_preview || "Summary could not be generated.";
    
    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            // Call the backend endpoint to generate and send the PDF
            const response = await fetch('https://api-dealpulse.logicleap.in/api/generate-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Send the full results object, which contains the summary and details
                body: JSON.stringify(results), 
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to generate PDF');
            }

            // Get the PDF file as a "blob"
            const blob = await response.blob();
            
            // Create a temporary link in memory to trigger the browser download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            // Get the original filename from the details if it exists
            const originalName = results?.details?.original_name || "document";
            // Create a clean report filename
            const reportFilename = `Report-${originalName.replace(/\.[^/.]+$/, "")}.pdf`;
            
            link.setAttribute('download', reportFilename);
            
            // Append to, click, and remove the link
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url); // Clean up the temporary URL

        } catch (error) {
            console.error('Download failed:', error);
            alert(`Download failed: ${error.message}`); // Show a simple error to the user
        } finally {
            setIsDownloading(false);
        }
    };

  return (
    <div className="analysis-results-content">
        <h4>Analysis Summary</h4>
        {/* Display the summary text */}
        <div className="summary-text-box">
             {/* Split summary into paragraphs for better readability */}
             {summaryText.split('\n').map((paragraph, index) => (
                 paragraph.trim() ? <p key={index}>{paragraph}</p> : null
             ))}
        </div>

        {/* --- You can add sections here later to display more details from results.details if needed --- */}

        {/* Download Button */}
        <button 
          className="download-report-btn"
          onClick={handleDownload} // Add onClick handler
          disabled={isDownloading}  // Disable button while downloading
        >
            {/* Download Icon SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            
            {/* Change text based on downloading state */}
            {isDownloading ? 'Generating...' : 'Download Full Report'}
        </button>
    </div>
  );
}
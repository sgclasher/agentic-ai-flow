'use client';

import { useRef } from 'react';
import useAgenticStore from '../store/useAgenticStore';

// Sample data from NOW-SCRIPT-OUTPUT-SIMPLE.txt
const sampleData = {
  "x_nowge_rfx_ai": {
    "use_cases": [
      // We'll get this from the real data, this is just a structure reference
    ]
  }
};

export default function FileUploader() {
  const fileInputRef = useRef(null);
  const { loadAgenticData, setAgenticData, error } = useAgenticStore();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await loadAgenticData(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleLoadSampleData = () => {
    // In a real app, we would fetch this from an API or local file
    // For demo purposes, load the sample data hardcoded or imported
    fetch('/api/sample-data')
      .then(response => response.json())
      .then(data => {
        setAgenticData(data);
      })
      .catch(error => {
        console.error('Error loading sample data:', error);
      });
  };

  return (
    <div className="file-uploader" onClick={handleClick}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".json"
        onChange={handleFileChange}
      />
      <div>
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 14.9861C11 15.5384 11.4477 15.9861 12 15.9861C12.5523 15.9861 13 15.5384 13 14.9861V7.82831L16.2428 11.0711C16.6333 11.4616 17.2665 11.4616 17.657 11.0711C18.0475 10.6806 18.0475 10.0474 17.657 9.65692L12.7071 4.70703C12.3166 4.31651 11.6834 4.31651 11.2929 4.70703L6.34315 9.65692C5.95262 10.0474 5.95262 10.6806 6.34315 11.0711C6.73367 11.4616 7.36684 11.4616 7.75736 11.0711L11 7.82831V14.9861Z" fill="#3498db" />
          <path d="M3 19.9861C3 19.4338 3.44772 18.9861 4 18.9861H20C20.5523 18.9861 21 19.4338 21 19.9861C21 20.5384 20.5523 20.9861 20 20.9861H4C3.44772 20.9861 3 20.5384 3 19.9861Z" fill="#3498db" />
        </svg>
      </div>
      <div className="uploader-text">Click to upload ServiceNow Agentic AI data (.json)</div>
      <button className="sample-data-button" onClick={(e) => { e.stopPropagation(); handleLoadSampleData(); }}>
        Load Sample Data
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
} 
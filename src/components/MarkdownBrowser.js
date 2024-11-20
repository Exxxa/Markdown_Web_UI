import React, { useState, useEffect } from 'react';
import { marked } from 'marked';

// Markdown File List Component
const MarkdownFileList = ({ files, onFileSelect }) => {
  // Ensure files is an array
  const safeFiles = Array.isArray(files) ? files : [];

  return (
    <div className="w-1/4 h-full bg-white shadow-md rounded-lg p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Project Files</h2>
      {safeFiles.length === 0 ? (
        <p className="text-gray-500">No markdown files found</p>
      ) : (
        safeFiles.map((file) => (
          <div 
            key={file} 
            onClick={() => onFileSelect(file)}
            className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
          >
            {file}
          </div>
        ))
      )}
    </div>
  );
};

// Markdown Viewer Component
const MarkdownViewer = ({ file, content }) => {
  return (
    <div className="w-3/4 h-full bg-white shadow-md rounded-lg p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">{file || 'Select a file'}</h2>
      <div 
        className="prose max-w-full"
        dangerouslySetInnerHTML={{ 
          __html: marked.parse(content || '# No file selected') 
        }} 
      />
    </div>
  );
};

// Main Application Component
const MarkdownBrowser = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');

  // Fetch files on component mount
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('/api/markdown-files');
        const markdownFiles = await response.json();
        
        // Ensure markdownFiles is an array
        if (Array.isArray(markdownFiles)) {
          setFiles(markdownFiles);
        } else if (markdownFiles && markdownFiles.files) {
          // Handle case where response might be nested
          setFiles(markdownFiles.files);
        } else {
          console.error('Unexpected response format:', markdownFiles);
          setFiles([]);
        }
      } catch (error) {
        console.error('Error fetching markdown files:', error);
        setFiles([]);
      }
    };
    fetchFiles();
  }, []);

  // Fetch content when a file is selected
  useEffect(() => {
    const fetchFileContent = async () => {
      if (selectedFile) {
        try {
          const response = await fetch(`/api/markdown-content?filename=${selectedFile}`);
          const content = await response.text();
          setFileContent(content);
        } catch (error) {
          console.error('Error fetching file content:', error);
          setFileContent('# Error loading file');
        }
      }
    };
    fetchFileContent();
  }, [selectedFile]);

  return (
    <div className="flex h-[calc(100vh-100px)] p-4 space-x-4">
      <MarkdownFileList 
        files={files} 
        onFileSelect={setSelectedFile} 
      />
      <MarkdownViewer 
        file={selectedFile} 
        content={fileContent} 
      />
    </div>
  );
};

export default MarkdownBrowser;
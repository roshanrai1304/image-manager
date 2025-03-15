import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../services/api';

const UploadContainer = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f5f5f5;
  border-radius: 8px;
`;

const UploadForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  min-height: 100px;
`;

const Button = styled.button`
  background-color: #f47373;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background-color: #e06666;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const FileInput = styled.div`
  position: relative;
  
  input[type="file"] {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  
  .file-label {
    display: block;
    background-color: #e9e9e9;
    color: #333;
    padding: 0.75rem;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
  }
`;

const ProgressBar = styled.div<{ progress: number }>`
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  margin-top: 10px;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.progress}%;
    background-color: #4caf50;
    border-radius: 5px;
    transition: width 0.3s ease;
  }
`;

interface ImageUploadProps {
  onUploadComplete: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadComplete }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('description', description);
    
    setIsUploading(true);
    setProgress(0);
    
    try {
      await api.post('/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percentCompleted);
        },
      });
      
      setTitle('');
      setDescription('');
      setFile(null);
      setFileName('');
      onUploadComplete();
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <UploadContainer>
      <h2>Upload New Image</h2>
      <UploadForm onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Image Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        
        <FileInput>
          <div className="file-label">
            {fileName || 'Choose an image file'}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </FileInput>
        
        {isUploading && <ProgressBar progress={progress} />}
      </UploadForm>
    </UploadContainer>
  );
};

export default ImageUpload; 
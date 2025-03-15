import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { Image } from '../types';

interface ImageAnalysisProps {
  image: Image;
  onAnalysisComplete: (imageId: string, description: string) => void;
}

const AnalysisContainer = styled.div`
  margin-top: 1rem;
  padding: 1.5rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const AnalysisForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  min-height: 100px;
  font-size: 1rem;
`;

const Button = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background-color: #3a7bc8;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ResultContainer = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  border-left: 4px solid #4a90e2;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-left: 10px;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const SuccessMessage = styled.div`
  background-color: #e6f7e6;
  color: #2e7d32;
  padding: 0.75rem;
  border-radius: 4px;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ImageAnalysis: React.FC<ImageAnalysisProps> = ({ image, onAnalysisComplete }) => {
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setError(null);
    setUpdateSuccess(false);
    
    try {
      const response = await api.post(`/images/${image.id}/analyze`, { prompt });
      
      if (response.data && response.data.image && response.data.image.ai_description) {
        console.log('Analysis response:', response.data.image);
        const description = response.data.image.ai_description;
        setResult(description);
        
        // Call the parent component's callback to update the image
        onAnalysisComplete(image.id, description);
        
        // Show success message
        setUpdateSuccess(true);
        
        // Clear the success message after 3 seconds
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 3000);
      } else {
        setError('Received an unexpected response format');
        console.error('Unexpected response format:', response.data);
      }
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      console.error('Error analyzing image:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <AnalysisContainer>
      <h3>Analyze with GPT</h3>
      <AnalysisForm onSubmit={handleSubmit}>
        <TextArea
          placeholder="Enter a prompt for GPT analysis..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
        />
        
        <Button type="submit" disabled={isAnalyzing}>
          {isAnalyzing ? (
            <>
              Analyzing... <LoadingSpinner />
            </>
          ) : (
            'Analyze Image'
          )}
        </Button>
      </AnalysisForm>
      
      {updateSuccess && (
        <SuccessMessage>
          Description updated successfully!
        </SuccessMessage>
      )}
      
      {error && (
        <div style={{ color: 'red', marginTop: '1rem' }}>
          {error}
        </div>
      )}
      
      {result && (
        <ResultContainer>
          <h4>Analysis Result:</h4>
          <p style={{ whiteSpace: 'pre-wrap' }}>{result}</p>
        </ResultContainer>
      )}
    </AnalysisContainer>
  );
};

export default ImageAnalysis; 
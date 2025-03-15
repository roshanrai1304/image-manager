import React, { useState } from 'react';
import styled from 'styled-components';
import { Image } from '../types';
import ImageAnalysis from './ImageAnalysis';

interface ImageGridProps {
  images: Image[];
  onDelete: (id: string) => void;
  onUpdateImage: (id: string, updates: Partial<Image>) => void;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const ImageItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  break-inside: avoid;
`;

const ImageCard = styled.div`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ImageContainer = styled.div`
  height: 200px;
  overflow: hidden;
  position: relative;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const ImageInfo = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ImageTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #333;
`;

const ImageDescriptionContainer = styled.div`
  margin: 0 0 1rem 0;
  flex-grow: 1;
`;

const ImageDescription = styled.p<{ expanded: boolean }>`
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  overflow: hidden;
  display: ${props => props.expanded ? 'block' : '-webkit-box'};
  -webkit-line-clamp: ${props => props.expanded ? 'unset' : '3'};
  -webkit-box-orient: vertical;
  margin-bottom: ${props => props.expanded ? '0.5rem' : '0'};
`;

const DescriptionToggle = styled.button`
  background: none;
  border: none;
  color: #4a90e2;
  font-size: 0.8rem;
  padding: 0;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 0.25rem;
  
  &:hover {
    color: #3a80d2;
  }
`;

const ImageDate = styled.span`
  font-size: 0.8rem;
  color: #999;
  margin-bottom: 0.75rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
`;

const Button = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  flex: 1;
`;

const DeleteButton = styled(Button)`
  background-color: #f47373;
  color: white;
  
  &:hover {
    background-color: #e06666;
  }
`;

const AnalyzeButton = styled(Button)`
  background-color: #4a90e2;
  color: white;
  
  &:hover {
    background-color: #3a80d2;
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  color: #666;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin: 1rem 0;
  
  h2 {
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  p {
    color: #666;
  }
`;

const ImageGrid: React.FC<ImageGridProps> = ({ images, onDelete, onUpdateImage }) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [expandedImageId, setExpandedImageId] = useState<string | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});

  const handleImageError = (imageId: string) => {
    setImageErrors(prev => ({ ...prev, [imageId]: true }));
    console.error(`Failed to load image with ID: ${imageId}`);
  };

  const toggleAnalysis = (imageId: string) => {
    setExpandedImageId(expandedImageId === imageId ? null : imageId);
  };

  const toggleDescription = (imageId: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [imageId]: !prev[imageId]
    }));
  };

  const handleAnalysisComplete = (imageId: string, description: string) => {
    onUpdateImage(imageId, { description });
  };

  // Function to check if description is long enough to need truncation
  const isDescriptionLong = (description: string) => {
    return description && description.length > 150;
  };

  if (!images || !Array.isArray(images) || images.length === 0) {
    return (
      <EmptyState>
        <h2>No images found</h2>
        <p>Upload your first image to get started!</p>
      </EmptyState>
    );
  }

  return (
    <Grid>
      {images.map((image) => (
        <ImageItemContainer key={image.id}>
          <ImageCard>
            <ImageContainer>
              {imageErrors[image.id] ? (
                <ImagePlaceholder>Image not available</ImagePlaceholder>
              ) : (
                <StyledImage 
                  src={image.url} 
                  alt={image.title} 
                  onError={() => handleImageError(image.id)}
                  crossOrigin="anonymous"
                />
              )}
            </ImageContainer>
            <ImageInfo>
              <ImageTitle>{image.title}</ImageTitle>
              <ImageDescriptionContainer>
                {image.description ? (
                  <>
                    <ImageDescription expanded={!!expandedDescriptions[image.id]}>
                      {image.description}
                    </ImageDescription>
                    {isDescriptionLong(image.description) && (
                      <DescriptionToggle onClick={() => toggleDescription(image.id)}>
                        {expandedDescriptions[image.id] ? 'Show less' : 'Read more'}
                      </DescriptionToggle>
                    )}
                  </>
                ) : (
                  <ImageDescription expanded={false}>
                    No description available
                  </ImageDescription>
                )}
              </ImageDescriptionContainer>
              <ImageDate>
                {new Date(image.createdAt).toLocaleDateString()}
              </ImageDate>
              <ButtonGroup>
                <DeleteButton onClick={() => onDelete(image.id)}>
                  Delete
                </DeleteButton>
                <AnalyzeButton onClick={() => toggleAnalysis(image.id)}>
                  {expandedImageId === image.id ? 'Hide Analysis' : 'Analyze'}
                </AnalyzeButton>
              </ButtonGroup>
            </ImageInfo>
          </ImageCard>
          
          {expandedImageId === image.id && (
            <ImageAnalysis 
              image={image} 
              onAnalysisComplete={handleAnalysisComplete} 
            />
          )}
        </ImageItemContainer>
      ))}
    </Grid>
  );
};

export default ImageGrid; 
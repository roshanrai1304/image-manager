import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import ImageUpload from '../components/ImageUpload';
import ImageGrid from '../components/ImageGrid';
import { getCurrentUser } from '../services/auth';
import api from '../services/api';
import { User, Image } from '../types';

const HomeContainer = styled.div`
  min-height: 100vh;
  background-color: #f9f9f9;
`;

const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
`;

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const navigate = useNavigate();

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/images');
      
      // Check if response.data is already an array (transformed by interceptor)
      if (Array.isArray(response.data)) {
        setImages(response.data);
      } 
      // Check if response.data.images exists and is an array
      else if (response.data && Array.isArray(response.data.images)) {
        setImages(response.data.images);
      } 
      else {
        console.error('Unexpected response format:', response.data);
        setImages([]);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          navigate('/login');
          return;
        }
        setUser(currentUser);
        fetchImages();
      } catch (error) {
        console.error("Auth check error:", error);
        navigate('/login');
      } finally {
        setIsAuthChecking(false);
      }
    };
    
    checkAuth();
  }, [navigate, fetchImages]);

  const handleImageUpload = useCallback(() => {
    fetchImages();
  }, [fetchImages]);

  const handleDeleteImage = useCallback(async (id: string) => {
    try {
      await api.delete(`/images/${id}`);
      setImages(prevImages => prevImages.filter(image => image.id !== id));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }, []);

  const handleUpdateImage = useCallback((id: string, updates: Partial<Image>) => {
    setImages(prevImages => 
      prevImages.map(image => 
        image.id === id ? { ...image, ...updates } : image
      )
    );
  }, []);

  if (isAuthChecking) {
    return <div>Checking authentication...</div>;
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <HomeContainer>
      <Navbar user={user} />
      <Content>
        <h1>Your Images</h1>
        <ImageUpload onUploadComplete={handleImageUpload} />
        
        {isLoading ? (
          <LoadingIndicator>Loading images...</LoadingIndicator>
        ) : (
          <ImageGrid 
            images={images} 
            onDelete={handleDeleteImage} 
            onUpdateImage={handleUpdateImage}
          />
        )}
      </Content>
    </HomeContainer>
  );
};

export default Home; 
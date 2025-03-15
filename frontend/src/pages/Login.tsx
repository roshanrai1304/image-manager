import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import AuthForm from '../components/AuthForm';
import { login } from '../services/auth';
import { AuthFormData } from '../types';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #8d7b6c;
  padding: 20px;
`;

const StyledLink = styled(Link)`
  margin-top: 15px;
  color: white;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: #ff0033;
  margin-top: 10px;
  background-color: rgba(255, 0, 51, 0.1);
  padding: 10px;
  border-radius: 4px;
  text-align: center;
`;

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (data: AuthFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await login(data);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <AuthForm type="login" onSubmit={handleLogin} isLoading={isLoading} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <StyledLink to="/register">Don't have an account? Register here</StyledLink>
    </LoginContainer>
  );
};

export default Login; 
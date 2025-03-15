import React, { useState } from 'react';
import styled from 'styled-components';
import { AuthFormData } from '../types';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: AuthFormData) => void;
  isLoading: boolean;
}

const FormContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f5f5f5;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 12px;
  background-color: #f47373;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  text-transform: uppercase;
  
  &:hover {
    background-color: #e06666;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const PhotoIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background-color: #aaa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 40px;
    height: 40px;
    color: white;
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 12px;
  color: #777;
`;

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<AuthFormData>({
    username: '',
    password: '',
    email: type === 'register' ? '' : undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <FormContainer>
      <PhotoIcon>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </PhotoIcon>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        {type === 'register' && (
          <FormGroup>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>
        )}
        
        <FormGroup>
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : type === 'login' ? 'LOGIN' : 'REGISTER'}
        </Button>
      </Form>
      
      <Copyright>
        Copyright © {new Date().getFullYear()} Image Manager, Inc
      </Copyright>
    </FormContainer>
  );
};

export default AuthForm; 
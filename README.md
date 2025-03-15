# Image Manager Application

## Project Overview

Image Manager is a web application that allows users to securely upload, store, and analyze images. The application features user authentication, integration with Amazon S3 for image storage, and AI-powered image analysis using ChatGPT.

## Features

- **User Authentication**: Register, login, and secure session management
- **Image Upload**: Upload images to Amazon S3 with progress tracking
- **Image Management**: View, delete, and organize your uploaded images
- **AI Image Analysis**: Generate descriptions of your images using ChatGPT
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Styled Components for styling
- React Router for navigation
- Axios for API communication

### Backend
- Python Flask for the API
- Flask-JWT-Extended for authentication
- SQLAlchemy for database ORM
- PostgreSQL for data storage
- Amazon S3 for image storage
- OpenAI API for image analysis

## Getting Started

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- PostgreSQL
- AWS account with S3 access
- OpenAI API key (for AI features)

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/image-manager.git
cd image-manager
```

2. Create and configure environment variables:

Create a `.env` file in the backend directory:
```
SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_secret
DATABASE_URL=postgresql://username:password@localhost/image_app
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
S3_BUCKET=your_s3_bucket_name
S3_REGION=your_s3_region
OPENAI_API_KEY=your_openai_api_key
```

### Backend Setup

1. Create a virtual environment and install dependencies:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. Initialize the database:
```bash
flask db init
flask db migrate
flask db upgrade
```

3. Start the Flask server:
```bash
python run.py
```

The backend API will be available at http://localhost:5000.

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend application will be available at http://localhost:5173.

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register`: Register a new user
  - Request body: `{ "username": "user", "email": "user@example.com", "password": "password" }`
  - Response: `{ "message": "User registered successfully", "access_token": "token", "user": {...} }`

- `POST /api/auth/login`: Login a user
  - Request body: `{ "username": "user", "password": "password" }`
  - Response: `{ "message": "Login successful", "access_token": "token", "user": {...} }`

- `GET /api/auth/me`: Get current user information
  - Headers: `Authorization: Bearer token`
  - Response: User object

### Image Endpoints

- `POST /api/images`: Upload an image
  - Headers: `Authorization: Bearer token`
  - Body: FormData with `image` file and optional `analyze` flag
  - Response: `{ "message": "Image uploaded successfully", "image": {...} }`

- `GET /api/images`: Get all images for the current user
  - Headers: `Authorization: Bearer token`
  - Response: `{ "images": [...] }`

- `GET /api/images/:id`: Get a specific image
  - Headers: `Authorization: Bearer token`
  - Response: Image object

- `DELETE /api/images/:id`: Delete an image
  - Headers: `Authorization: Bearer token`
  - Response: `{ "message": "Image deleted successfully" }`

- `POST /api/images/:id/analyze`: Analyze an image with AI
  - Headers: `Authorization: Bearer token`
  - Body: `{ "prompt": "Optional custom prompt" }`
  - Response: `{ "message": "Image analyzed successfully", "image": {...} }`

## Security

- HTTPS is recommended for production deployment
- JWT authentication for API access
- Secure password hashing
- S3 bucket access controls
- Input validation and sanitization

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for the ChatGPT API
- AWS for S3 storage services
- The Flask and React communities for their excellent documentation

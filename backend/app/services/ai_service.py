import requests
import base64
from flask import current_app
import boto3
from io import BytesIO
from openai import OpenAI

class AIService:
    def __init__(self):
        self.api_key = current_app.config['OPENAI_API_KEY']
        # Initialize OpenAI client
        self.client = OpenAI(api_key=self.api_key)
        # Initialize S3 client for downloading images
        self.s3 = boto3.client(
            's3',
            aws_access_key_id=current_app.config['AWS_ACCESS_KEY'],
            aws_secret_access_key=current_app.config['AWS_SECRET_KEY'],
            region_name=current_app.config['S3_REGION']
        )
        self.bucket = current_app.config['S3_BUCKET']

    def download_from_s3(self, s3_url):
        """Download image content from S3 URL"""
        try:
            # Extract the key from the S3 URL
            # URL format: https://bucket-name.s3.region.amazonaws.com/key
            parts = s3_url.replace('https://', '').split('/')
            key = '/'.join(parts[1:])  # Everything after the bucket name
            
            # Get the object from S3
            response = self.s3.get_object(Bucket=self.bucket, Key=key)
            return response['Body'].read()
        except Exception as e:
            return None

    def download_from_url(self, url):
        """Download image content from any URL"""
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response.content
        except Exception as e:
            return None

    def encode_image(self, image_data):
        """Encodes image data to base64 format."""
        try:
            return base64.b64encode(image_data).decode("utf-8")
        except Exception as e:
            return None

    def analyze_image(self, image_url, custom_prompt=None):
        """Analyze an image using GPT-4 Vision by encoding it in base64.
        
        Args:
            image_url (str): URL to the image (S3 or other)
            custom_prompt (str, optional): Custom prompt to use for analysis.
        
        Returns:
            str: Model's response.
        """
        if not self.api_key:
            return "AI image analysis is not configured."

        # Download the image content
        if image_url.startswith(f"https://{self.bucket}.s3."):
            # It's an S3 URL
            image_data = self.download_from_s3(image_url)
        else:
            # It's a regular URL
            image_data = self.download_from_url(image_url)
        
        if not image_data:
            return "Failed to download image."

        # Encode the image
        base64_image = self.encode_image(image_data)
        if not base64_image:
            return "Failed to encode image."

        # Use custom prompt if provided, otherwise use default
        prompt_text = custom_prompt or "Please describe this image in detail."

        try:
            # Create the completion using the OpenAI client
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt_text},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{base64_image}"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=300
            )
            
            # Extract the content from the response
            return response.choices[0].message.content
        except Exception as e:
            return f"Error analyzing image: {str(e)}"

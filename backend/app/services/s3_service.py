import boto3
import uuid
from flask import current_app
from werkzeug.utils import secure_filename

class S3Service:
    def __init__(self):
        self.s3 = boto3.client(
            's3',
            aws_access_key_id=current_app.config['AWS_ACCESS_KEY'],
            aws_secret_access_key=current_app.config['AWS_SECRET_KEY'],
            region_name=current_app.config['S3_REGION']
        )
        self.bucket = current_app.config['S3_BUCKET']
    
    def upload_file(self, file, user_id):
        """Upload a file to S3 bucket and return the URL"""
        # Generate a unique filename
        original_filename = secure_filename(file.filename)
        extension = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else ''
        filename = f"{user_id}/{uuid.uuid4()}.{extension}" if extension else f"{user_id}/{uuid.uuid4()}"
        
        # Upload file to S3
        self.s3.upload_fileobj(
            file,
            self.bucket,
            filename,
            ExtraArgs={
                'ContentType': file.content_type
            }
        )
        
        # Generate URL
        url = f"https://{self.bucket}.s3.{current_app.config['S3_REGION']}.amazonaws.com/{filename}"
        
        return {
            'filename': filename,
            'original_filename': original_filename,
            'url': url,
            'content_type': file.content_type,
            'size': file.content_length
        }
    
    def delete_file(self, filename):
        """Delete a file from S3 bucket"""
        self.s3.delete_object(
            Bucket=self.bucket,
            Key=filename
        )
        return True 
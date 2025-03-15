from app import db
from datetime import datetime

class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    s3_url = db.Column(db.String(512), nullable=False)
    content_type = db.Column(db.String(100), nullable=False)
    size = db.Column(db.Integer, nullable=False)  # Size in bytes
    ai_description = db.Column(db.Text, nullable=True)  # AI-generated description
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'filename': self.filename,
            'original_filename': self.original_filename,
            's3_url': self.s3_url,
            'content_type': self.content_type,
            'size': self.size,
            'ai_description': self.ai_description,
            'uploaded_at': self.uploaded_at.isoformat(),
            'user_id': self.user_id
        } 
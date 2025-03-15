from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.image import Image
from app.models.user import User
from app.services.s3_service import S3Service
from app.services.ai_service import AIService

images_bp = Blueprint('images', __name__)

@images_bp.route('', methods=['POST'])
@jwt_required()
def upload_image():
    user_id = get_jwt_identity()
    
    # Check if user exists
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Check if file is in request
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['image']
    
    # Check if file is empty
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Check if file is an image
    if not file.content_type.startswith('image/'):
        return jsonify({'error': 'File must be an image'}), 400
    
    try:
        # Upload file to S3
        s3_service = S3Service()
        file_data = s3_service.upload_file(file, user_id)
        
        # Create image record in database
        image = Image(
            filename=file_data['filename'],
            original_filename=file_data['original_filename'],
            s3_url=file_data['url'],
            content_type=file_data['content_type'],
            size=file_data['size'],
            user_id=user_id
        )
        
        db.session.add(image)
        db.session.commit()
        
        # Analyze image with AI (if requested)
        analyze = request.form.get('analyze', 'false').lower() == 'true'
        if analyze:
            ai_service = AIService()
            custom_prompt = request.form.get('prompt')  # Get custom prompt if provided
            image.ai_description = ai_service.analyze_image(file_data['url'], custom_prompt)
            db.session.commit()
        
        return jsonify({
            'message': 'Image uploaded successfully',
            'image': image.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@images_bp.route('', methods=['GET'])
@jwt_required()
def get_images():
    user_id = get_jwt_identity()
    
    # Get all images for the user
    images = Image.query.filter_by(user_id=user_id).order_by(Image.uploaded_at.desc()).all()
    
    return jsonify({
        'images': [image.to_dict() for image in images]
    }), 200

@images_bp.route('/<int:image_id>', methods=['GET'])
@jwt_required()
def get_image(image_id):
    user_id = get_jwt_identity()
    
    # Get image by ID
    image = Image.query.filter_by(id=image_id, user_id=user_id).first()
    
    if not image:
        return jsonify({'error': 'Image not found'}), 404
    
    return jsonify(image.to_dict()), 200

@images_bp.route('/<int:image_id>', methods=['DELETE'])
@jwt_required()
def delete_image(image_id):
    user_id = get_jwt_identity()
    
    # Get image by ID
    image = Image.query.filter_by(id=image_id, user_id=user_id).first()
    
    if not image:
        return jsonify({'error': 'Image not found'}), 404
    
    # Delete file from S3
    s3_service = S3Service()
    s3_service.delete_file(image.filename)
    
    # Delete image record from database
    db.session.delete(image)
    db.session.commit()
    
    return jsonify({'message': 'Image deleted successfully'}), 200

@images_bp.route('/<int:image_id>/analyze', methods=['POST'])
@jwt_required()
def analyze_image(image_id):
    user_id = get_jwt_identity()
    
    # Get image by ID
    image = Image.query.filter_by(id=image_id, user_id=user_id).first()
    
    if not image:
        return jsonify({'error': 'Image not found'}), 404
    
    # Get custom prompt from request data if provided
    data = request.get_json() or {}
    custom_prompt = data.get('prompt')
    
    # Analyze image with AI
    ai_service = AIService()
    image.ai_description = ai_service.analyze_image(image.s3_url, custom_prompt)
    db.session.commit()
    
    return jsonify({
        'message': 'Image analyzed successfully',
        'image': image.to_dict()
    }), 200 
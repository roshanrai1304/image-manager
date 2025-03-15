from flask import Blueprint, jsonify

health_bp = Blueprint('health', __name__)

@health_bp.route('', methods=['GET', 'HEAD'])
def health_check():
    """
    Basic health check endpoint that returns a 200 OK response
    when the application is running properly.
    """
    return jsonify({
        'status': 'healthy',
        'message': 'API is running'
    }), 200 
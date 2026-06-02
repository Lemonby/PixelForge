from flask import Blueprint, request, jsonify
from services.compression import save_with_quality, simulate_jpeg_compression

compress_bp = Blueprint('compress', __name__)

@compress_bp.route('/save', methods=['POST'])
def save_quality_route():
    data = request.json
    image_b64 = data.get('image')
    quality = int(data.get('quality', 90))
    fmt = data.get('format', 'jpeg') # 'jpeg' or 'png'
    
    try:
        res = save_with_quality(image_b64, quality, fmt)
        return jsonify({'status': 'ok', 'result_image': res})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@compress_bp.route('/simulate', methods=['POST'])
def simulate_route():
    data = request.json
    image_b64 = data.get('image')
    quality = int(data.get('quality', 50))
    entropy_method = data.get('entropy_method', 'huffman')
    
    try:
        res = simulate_jpeg_compression(image_b64, quality, entropy_method)
        return jsonify(res)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

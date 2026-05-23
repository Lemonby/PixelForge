from flask import Blueprint, request, jsonify
from services.restoration import gaussian_blur, median_filter, salt_pepper_removal

filter_bp = Blueprint('filter', __name__)

@filter_bp.route('/gaussian', methods=['POST'])
def gaussian_route():
    data = request.json
    kernel_size = int(data.get('kernel_size', 5))
    res = gaussian_blur(data['image'], kernel_size)
    return jsonify({'status': 'ok', 'result_image': res})

@filter_bp.route('/median', methods=['POST'])
def median_route():
    data = request.json
    kernel_size = int(data.get('kernel_size', 5))
    res = median_filter(data['image'], kernel_size)
    return jsonify({'status': 'ok', 'result_image': res})

@filter_bp.route('/noise-removal', methods=['POST'])
def noise_removal_route():
    data = request.json
    kernel_size = int(data.get('kernel_size', 5))
    res = salt_pepper_removal(data['image'], kernel_size)
    return jsonify({'status': 'ok', 'result_image': res})

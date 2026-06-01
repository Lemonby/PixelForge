from flask import Blueprint, request, jsonify
from services.edge_binary import apply_threshold, apply_edge_detection, apply_morphology

edge_bp = Blueprint('edge', __name__)

@edge_bp.route('/threshold', methods=['POST'])
def threshold_route():
    data = request.json
    if not data or 'image' not in data:
        return jsonify({'status': 'error', 'message': 'Missing image parameter'}), 400
        
    thresh_val = int(data.get('threshold', 127))
    res = apply_threshold(data['image'], thresh_val)
    return jsonify({'status': 'ok', 'result_image': res})

@edge_bp.route('/detect', methods=['POST'])
def edge_detection_route():
    data = request.json
    if not data or 'image' not in data:
        return jsonify({'status': 'error', 'message': 'Missing image parameter'}), 400
        
    method = data.get('method', 'canny')
    params = {
        'low': int(data.get('low', 50)),
        'high': int(data.get('high', 150))
    }
    
    res = apply_edge_detection(data['image'], method, params)
    return jsonify({'status': 'ok', 'result_image': res})

@edge_bp.route('/morphology', methods=['POST'])
def morphology_route():
    data = request.json
    if not data or 'image' not in data:
        return jsonify({'status': 'error', 'message': 'Missing image parameter'}), 400
        
    op = data.get('op', 'erode')
    kernel_shape = data.get('shape', 'rectangle')
    kernel_size = int(data.get('kernel_size', 3))
    
    res = apply_morphology(data['image'], op, kernel_shape, kernel_size)
    return jsonify({'status': 'ok', 'result_image': res})

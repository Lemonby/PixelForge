from flask import Blueprint, request, jsonify
from services.segmentation import apply_threshold_segmentation, apply_edge_segmentation, apply_region_segmentation

segment_bp = Blueprint('segment', __name__)

@segment_bp.route('/threshold', methods=['POST'])
def threshold_route():
    data = request.json
    image_b64 = data.get('image')
    threshold_val = int(data.get('threshold', 127))
    mode = data.get('mode', 'color') # 'color' or 'binary'
    
    try:
        res = apply_threshold_segmentation(image_b64, threshold_val, mode)
        return jsonify({'status': 'ok', 'result_image': res})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@segment_bp.route('/edge', methods=['POST'])
def edge_route():
    data = request.json
    image_b64 = data.get('image')
    low = int(data.get('low', 50))
    high = int(data.get('high', 150))
    mode = data.get('mode', 'color') # 'color' or 'binary'
    
    try:
        res = apply_edge_segmentation(image_b64, low, high, mode)
        return jsonify({'status': 'ok', 'result_image': res})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@segment_bp.route('/region', methods=['POST'])
def region_route():
    data = request.json
    image_b64 = data.get('image')
    num_clusters = int(data.get('clusters', 3))
    
    # target_cluster can be None (just simplify color) or an integer to extract it
    target_cluster = data.get('target_cluster')
    if target_cluster is not None:
        target_cluster = int(target_cluster)
        
    try:
        res = apply_region_segmentation(image_b64, num_clusters, target_cluster)
        return jsonify({'status': 'ok', 'result_image': res})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

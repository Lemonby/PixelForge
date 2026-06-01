from flask import Blueprint, request, jsonify
from services.color_processing import apply_grayscale, apply_channel_split, apply_color_adjust

color_bp = Blueprint('color', __name__)

@color_bp.route('/grayscale', methods=['POST'])
def grayscale_route():
    data = request.json
    if not data or 'image' not in data:
        return jsonify({'status': 'error', 'message': 'Missing image parameter'}), 400
        
    method = data.get('method', 'luminosity_601')
    res = apply_grayscale(data['image'], method)
    return jsonify({'status': 'ok', 'result_image': res})

@color_bp.route('/channel-split', methods=['POST'])
def channel_split_route():
    data = request.json
    if not data or 'image' not in data:
        return jsonify({'status': 'error', 'message': 'Missing image parameter'}), 400
        
    channel = data.get('channel', 'r')
    representation = data.get('representation', 'grayscale')
    res = apply_channel_split(data['image'], channel, representation)
    return jsonify({'status': 'ok', 'result_image': res})

@color_bp.route('/adjust', methods=['POST'])
def color_adjust_route():
    data = request.json
    if not data or 'image' not in data:
        return jsonify({'status': 'error', 'message': 'Missing image parameter'}), 400
        
    hue_shift = float(data.get('hue', 0))
    sat_adjust = float(data.get('saturation', 0))
    res = apply_color_adjust(data['image'], hue_shift, sat_adjust)
    return jsonify({'status': 'ok', 'result_image': res})

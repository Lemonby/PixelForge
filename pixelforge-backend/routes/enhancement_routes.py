from flask import Blueprint, request, jsonify
from services.enhancement import adjust_brightness, adjust_contrast, histogram_equalization, sharpen, smooth, apply_adjustments

enhancement_bp = Blueprint('enhancement', __name__)

@enhancement_bp.route('/brightness', methods=['POST'])
def brightness_route():
    data = request.json
    res = adjust_brightness(data['image'], int(data.get('value', 0)))
    return jsonify({'status': 'ok', 'result_image': res})

@enhancement_bp.route('/contrast', methods=['POST'])
def contrast_route():
    data = request.json
    res = adjust_contrast(data['image'], int(data.get('value', 0)))
    return jsonify({'status': 'ok', 'result_image': res})

@enhancement_bp.route('/apply-adjustments', methods=['POST'])
def apply_adjustments_route():
    data = request.json
    res = apply_adjustments(data['image'], data.get('adjustments', {}))
    return jsonify({'status': 'ok', 'result_image': res})

@enhancement_bp.route('/histogram-eq', methods=['POST'])
def hist_eq_route():
    data = request.json
    res = histogram_equalization(data['image'])
    return jsonify({'status': 'ok', 'result_image': res})

@enhancement_bp.route('/sharpen', methods=['POST'])
def sharpen_route():
    data = request.json
    res = sharpen(data['image'], int(data.get('level', 1)))
    return jsonify({'status': 'ok', 'result_image': res})

@enhancement_bp.route('/smooth', methods=['POST'])
def smooth_route():
    data = request.json
    res = smooth(data['image'], int(data.get('level', 1)))
    return jsonify({'status': 'ok', 'result_image': res})

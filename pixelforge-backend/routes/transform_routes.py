from flask import Blueprint, request, jsonify
from services.geometric import rotate, flip, crop, resize, translate

transform_bp = Blueprint('transform', __name__)

@transform_bp.route('/rotate', methods=['POST'])
def rotate_route():
    data = request.json
    res = rotate(data['image'], int(data.get('angle', 0)))
    return jsonify({'status': 'ok', 'result_image': res})

@transform_bp.route('/flip', methods=['POST'])
def flip_route():
    data = request.json
    res = flip(data['image'], data.get('direction', 'h'))
    return jsonify({'status': 'ok', 'result_image': res})

@transform_bp.route('/crop', methods=['POST'])
def crop_route():
    data = request.json
    res = crop(data['image'], int(data['x']), int(data['y']), int(data['w']), int(data['h']))
    return jsonify({'status': 'ok', 'result_image': res})

@transform_bp.route('/resize', methods=['POST'])
def resize_route():
    data = request.json
    res = resize(data['image'], int(data['width']), int(data['height']))
    return jsonify({'status': 'ok', 'result_image': res})

@transform_bp.route('/translate', methods=['POST'])
def translate_route():
    data = request.json
    res = translate(data['image'], int(data['tx']), int(data['ty']))
    return jsonify({'status': 'ok', 'result_image': res})

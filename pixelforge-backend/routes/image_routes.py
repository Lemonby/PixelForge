from flask import Blueprint, request, jsonify
from utils.image_utils import decode_base64, encode_base64
import cv2
import numpy as np

image_bp = Blueprint('image', __name__)

@image_bp.route('/upload', methods=['POST'])
def upload():
    data = request.json
    if 'image' not in data:
        return jsonify({'error': 'No image provided'}), 400
    return jsonify({'status': 'ok', 'result_image': data['image']})

from flask import Blueprint, request, jsonify
from services.model_cnn import predict_gesture

cnn_bp = Blueprint('cnn', __name__)

@cnn_bp.route('/predict', methods=['POST'])
def predict_route():
    data = request.json
    if not data or 'image' not in data:
        return jsonify({'status': 'error', 'message': 'No image provided'}), 400
        
    overlay = data.get('overlay', False)
    try:
        res = predict_gesture(data['image'], overlay)
        return jsonify({
            'status': 'ok',
            'predicted_class': res['predicted_class'],
            'confidence': res['confidence'],
            'result_image': res['result_image']
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

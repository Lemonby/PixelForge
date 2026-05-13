import os

def create_file(path, content):
    dir_name = os.path.dirname(path)
    if dir_name:
        os.makedirs(dir_name, exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# routes/__init__.py
create_file('routes/__init__.py', '')

# services/__init__.py
create_file('services/__init__.py', '')

# utils/__init__.py
create_file('utils/__init__.py', '')

# routes/image_routes.py
create_file('routes/image_routes.py', '''from flask import Blueprint, request, jsonify
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
''')

# routes/enhancement_routes.py
create_file('routes/enhancement_routes.py', '''from flask import Blueprint, request, jsonify
from services.enhancement import adjust_brightness, adjust_contrast, histogram_equalization, sharpen, smooth

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
''')

# services/enhancement.py
create_file('services/enhancement.py', '''import cv2
import numpy as np
from utils.image_utils import decode_base64, encode_base64

def adjust_brightness(image_b64: str, value: int) -> str:
    img = decode_base64(image_b64)
    img = img.astype(np.float32)
    img = np.clip(img + value, 0, 255).astype(np.uint8)
    return encode_base64(img)

def adjust_contrast(image_b64: str, value: int) -> str:
    img = decode_base64(image_b64)
    f = 131 * (value + 127) / (127 * (131 - value))
    alpha_c = f
    gamma_c = 127 * (1 - f)
    img = cv2.addWeighted(img, alpha_c, img, 0, gamma_c)
    return encode_base64(img)

def histogram_equalization(image_b64: str) -> str:
    img = decode_base64(image_b64)
    if len(img.shape) == 3:
        img_yuv = cv2.cvtColor(img, cv2.COLOR_BGR2YUV)
        img_yuv[:,:,0] = cv2.equalizeHist(img_yuv[:,:,0])
        img = cv2.cvtColor(img_yuv, cv2.COLOR_YUV2BGR)
    else:
        img = cv2.equalizeHist(img)
    return encode_base64(img)

def sharpen(image_b64: str, level: int) -> str:
    img = decode_base64(image_b64)
    kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]])
    if level > 1:
        # adjust kernel intensity based on level
        kernel = np.array([[-1,-1,-1], [-1,8+level,-1], [-1,-1,-1]])
    img = cv2.filter2D(img, -1, kernel)
    return encode_base64(img)

def smooth(image_b64: str, level: int) -> str:
    img = decode_base64(image_b64)
    k = level * 2 + 1
    img = cv2.GaussianBlur(img, (k, k), 0)
    return encode_base64(img)
''')

# routes/transform_routes.py
create_file('routes/transform_routes.py', '''from flask import Blueprint, request, jsonify
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
''')

# services/geometric.py
create_file('services/geometric.py', '''import cv2
import numpy as np
from utils.image_utils import decode_base64, encode_base64

def rotate(image_b64: str, angle: int) -> str:
    img = decode_base64(image_b64)
    h, w = img.shape[:2]
    M = cv2.getRotationMatrix2D((w/2, h/2), angle, 1)
    img = cv2.warpAffine(img, M, (w, h))
    return encode_base64(img)

def flip(image_b64: str, direction: str) -> str:
    img = decode_base64(image_b64)
    flip_code = 1 if direction == 'h' else 0
    img = cv2.flip(img, flip_code)
    return encode_base64(img)

def crop(image_b64: str, x: int, y: int, w: int, h: int) -> str:
    img = decode_base64(image_b64)
    img = img[y:y+h, x:x+w]
    return encode_base64(img)

def resize(image_b64: str, width: int, height: int) -> str:
    img = decode_base64(image_b64)
    img = cv2.resize(img, (width, height))
    return encode_base64(img)

def translate(image_b64: str, tx: int, ty: int) -> str:
    img = decode_base64(image_b64)
    h, w = img.shape[:2]
    M = np.float32([[1, 0, tx], [0, 1, ty]])
    img = cv2.warpAffine(img, M, (w, h))
    return encode_base64(img)
''')

# app.py update
create_file('app.py', '''from flask import Flask
from flask_cors import CORS
import os
from routes.image_routes import image_bp
from routes.enhancement_routes import enhancement_bp
from routes.transform_routes import transform_bp

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024 # 50MB
    
    app.register_blueprint(image_bp, url_prefix='/api/image')
    app.register_blueprint(enhancement_bp, url_prefix='/api/enhancement')
    app.register_blueprint(transform_bp, url_prefix='/api/transform')

    @app.route('/')
    def index():
        return {'status': 'ok'}

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
''')

print("Backend files generated")

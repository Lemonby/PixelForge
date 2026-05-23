import cv2
import numpy as np
from utils.image_utils import decode_base64, encode_base64

def _get_interpolation_flag(interpolation: str) -> int:
    if interpolation == 'nearest':
        return cv2.INTER_NEAREST
    return cv2.INTER_LINEAR

def rotate(image_b64: str, angle: int, interpolation: str = 'bilinear') -> str:
    img = decode_base64(image_b64)
    h, w = img.shape[:2]
    M = cv2.getRotationMatrix2D((w/2, h/2), angle, 1)
    flags = _get_interpolation_flag(interpolation)
    img = cv2.warpAffine(img, M, (w, h), flags=flags)
    return encode_base64(img)

def flip(image_b64: str, direction: str) -> str:
    img = decode_base64(image_b64)
    flip_code = 1 if direction == 'h' else 0
    img = cv2.flip(img, flip_code)
    return encode_base64(img)

def crop(image_b64: str, x: int, y: int, w: int, h: int) -> str:
    img = decode_base64(image_b64)
    # Clamp bounding box coordinates to image dimensions to prevent empty/negative slice errors
    h_img, w_img = img.shape[:2]
    x_clamped = max(0, min(x, w_img - 1))
    y_clamped = max(0, min(y, h_img - 1))
    w_clamped = max(1, min(w, w_img - x_clamped))
    h_clamped = max(1, min(h, h_img - y_clamped))
    img = img[y_clamped:y_clamped+h_clamped, x_clamped:x_clamped+w_clamped]
    return encode_base64(img)

def resize(image_b64: str, width: int, height: int, interpolation: str = 'bilinear') -> str:
    img = decode_base64(image_b64)
    flags = _get_interpolation_flag(interpolation)
    img = cv2.resize(img, (width, height), interpolation=flags)
    return encode_base64(img)

def translate(image_b64: str, tx: int, ty: int, interpolation: str = 'bilinear') -> str:
    img = decode_base64(image_b64)
    h, w = img.shape[:2]
    M = np.float32([[1, 0, tx], [0, 1, ty]])
    flags = _get_interpolation_flag(interpolation)
    img = cv2.warpAffine(img, M, (w, h), flags=flags)
    return encode_base64(img)


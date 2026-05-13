import cv2
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

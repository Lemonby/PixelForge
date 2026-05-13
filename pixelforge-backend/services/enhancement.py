import cv2
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

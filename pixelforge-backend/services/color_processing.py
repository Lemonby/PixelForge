import cv2
import numpy as np
from utils.image_utils import decode_base64, encode_base64

def apply_grayscale(image_b64: str, method: str) -> str:
    """
    Apply Grayscale conversion using selected weighting method.
    Methods:
      - luminosity_601 (ITU-R 601 standard)
      - luminosity_709 (ITU-R 709 high-definition)
      - average (R+G+B)/3
      - desaturation (max(R,G,B) + min(R,G,B))/2
    """
    img = decode_base64(image_b64)
    if img is None:
        return ""
        
    # Check if already grayscale
    if len(img.shape) < 3 or img.shape[2] < 3:
        return image_b64
        
    b = img[:, :, 0].astype(np.float32)
    g = img[:, :, 1].astype(np.float32)
    r = img[:, :, 2].astype(np.float32)
    
    method = method.lower()
    
    if method == 'luminosity_601':
        gray = 0.299 * r + 0.587 * g + 0.114 * b
    elif method == 'luminosity_709':
        gray = 0.2126 * r + 0.7152 * g + 0.0722 * b
    elif method == 'average':
        gray = (r + g + b) / 3.0
    elif method == 'desaturation':
        max_val = np.maximum(np.maximum(r, g), b)
        min_val = np.minimum(np.minimum(r, g), b)
        gray = (max_val + min_val) / 2.0
    else:
        # Fallback to OpenCV default conversion (Luminosity BT.601)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
    gray = np.clip(gray, 0, 255).astype(np.uint8)
    return encode_base64(gray)

def apply_channel_split(image_b64: str, channel: str, representation: str) -> str:
    """
    Extract a single channel (R, G, B) from the image.
    Representation can be:
      - grayscale: replicates the single channel intensity as gray
      - color: preserves the channel's actual color (other channels zeroed)
    """
    img = decode_base64(image_b64)
    if img is None:
        return ""
        
    if len(img.shape) < 3 or img.shape[2] < 3:
        # Grayscale image can't be split into RGB
        return image_b64
        
    b_ch, g_ch, r_ch = cv2.split(img)
    zeros = np.zeros_like(b_ch)
    
    channel = channel.lower()
    rep = representation.lower()
    
    if channel == 'r':
        ch = r_ch
        color_img = cv2.merge([zeros, zeros, r_ch])
    elif channel == 'g':
        ch = g_ch
        color_img = cv2.merge([zeros, g_ch, zeros])
    else: # 'b'
        ch = b_ch
        color_img = cv2.merge([b_ch, zeros, zeros])
        
    if rep == 'color':
        res = color_img
    else: # grayscale
        res = cv2.merge([ch, ch, ch])
        
    return encode_base64(res)

def apply_color_adjust(image_b64: str, hue_shift: float, sat_adjust: float) -> str:
    """
    Adjust Hue and Saturation of the image using HSV color space.
    - hue_shift: shift in degrees [-180, 180]. 
                 OpenCV H is [0, 179] (mapping to 360 deg, so shift/2 is added circular).
    - sat_adjust: percentage shift [-100, 100]. S is scaled by (1 + sat_adjust/100).
    """
    img = decode_base64(image_b64)
    if img is None:
        return ""
        
    if len(img.shape) < 3 or img.shape[2] < 3:
        # Can't adjust color parameters on a grayscale image
        return image_b64
        
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)
    
    # 1. Circular Hue shifting (1 OpenCV H unit = 2 degrees)
    h_shift = int(hue_shift / 2)
    h = (h.astype(np.int32) + h_shift) % 180
    h = h.astype(np.uint8)
    
    # 2. Saturation scaling
    s = s.astype(np.float32) * (1.0 + sat_adjust / 100.0)
    s = np.clip(s, 0, 255).astype(np.uint8)
    
    hsv_adjusted = cv2.merge([h, s, v])
    res = cv2.cvtColor(hsv_adjusted, cv2.COLOR_HSV2BGR)
    return encode_base64(res)

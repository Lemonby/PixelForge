import cv2
import numpy as np
from utils.image_utils import decode_base64, encode_base64

def gaussian_blur(image_b64: str, kernel_size: int) -> str:
    """
    Apply Gaussian Blur (spatial filtering / kernel convolution) to the image.
    kernel_size must be a positive odd integer (e.g., 3, 5, 7).
    """
    img = decode_base64(image_b64)
    # Ensure kernel size is odd and valid
    if kernel_size % 2 == 0:
        kernel_size += 1
    kernel_size = max(1, kernel_size)
    
    img = cv2.GaussianBlur(img, (kernel_size, kernel_size), 0)
    return encode_base64(img)

def median_filter(image_b64: str, kernel_size: int) -> str:
    """
    Apply Median filter to the image.
    kernel_size must be a positive odd integer (e.g., 3, 5, 7).
    """
    img = decode_base64(image_b64)
    # Ensure kernel size is odd and valid
    if kernel_size % 2 == 0:
        kernel_size += 1
    kernel_size = max(1, kernel_size)
    
    img = cv2.medianBlur(img, kernel_size)
    return encode_base64(img)

def salt_pepper_removal(image_b64: str, kernel_size: int = 5) -> str:
    """
    Apply Salt & Pepper noise removal using a Median Filter, 
    which is the standard mathematical method for removing impulse noise.
    """
    return median_filter(image_b64, kernel_size)

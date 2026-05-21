import cv2
import numpy as np
from utils.image_utils import decode_base64

def calculate_histogram(image_b64: str, bins: int = 256):
    """
    Calculate histogram data untuk image (RGB).
    Returns histogram data untuk masing-masing channel R, G, B
    """
    img = decode_base64(image_b64)
    
    if img is None:
        return None
    
    # Pastikan image memiliki 3 channel (RGB)
    if len(img.shape) == 2:
        # Jika grayscale, convert ke BGR
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    elif img.shape[2] == 4:
        # Jika RGBA, konvert ke BGR
        img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)
    
    # OpenCV menggunakan BGR, kita convert ke RGB untuk frontend
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # Hitung histogram untuk masing-masing channel
    colors = ('r', 'g', 'b')
    histograms = {}
    
    for i, color in enumerate(colors):
        hist = cv2.calcHist([img_rgb], [i], None, [bins], [0, 256])
        histograms[color] = hist.flatten().tolist()
    
    return histograms

def calculate_grayscale_histogram(image_b64: str, bins: int = 256):
    """
    Calculate histogram untuk grayscale image.
    Returns histogram data dan normalized version
    """
    img = decode_base64(image_b64)
    
    if img is None:
        return None
    
    # Convert ke grayscale jika belum
    if len(img.shape) == 3:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    else:
        gray = img
    
    # Hitung histogram
    hist = cv2.calcHist([gray], [0], None, [bins], [0, 256])
    hist_data = hist.flatten().tolist()
    
    # Normalize histogram
    hist_normalized = (hist / hist.max()).flatten().tolist()
    
    return {
        'histogram': hist_data,
        'normalized': hist_normalized,
        'max_value': float(hist.max()),
        'min_value': float(hist.min())
    }

def get_image_statistics(image_b64: str):
    """
    Get image statistics seperti mean, std, min, max untuk masing-masing channel
    """
    img = decode_base64(image_b64)
    
    if img is None:
        return None
    
    # Convert BGR ke RGB
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    stats = {}
    colors = ('r', 'g', 'b')
    
    for i, color in enumerate(colors):
        channel = img_rgb[:, :, i]
        stats[color] = {
            'mean': float(np.mean(channel)),
            'std': float(np.std(channel)),
            'min': float(np.min(channel)),
            'max': float(np.max(channel)),
        }
    
    # Overall grayscale stats
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    stats['overall'] = {
        'mean': float(np.mean(gray)),
        'std': float(np.std(gray)),
        'min': float(np.min(gray)),
        'max': float(np.max(gray)),
    }
    
    return stats

def get_combined_histogram_data(image_b64: str, bins: int = 256):
    """
    Get combined histogram data (RGB channels + grayscale)
    Returns semua histogram data dalam satu response
    """
    rgb_hist = calculate_histogram(image_b64, bins)
    gray_hist = calculate_grayscale_histogram(image_b64, bins)
    stats = get_image_statistics(image_b64)
    
    return {
        'rgb_histogram': rgb_hist,
        'grayscale_histogram': gray_hist,
        'statistics': stats
    }

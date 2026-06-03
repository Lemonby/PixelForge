import cv2
import numpy as np
from utils.image_utils import decode_base64, encode_base64

def apply_threshold(image_b64: str, thresh_val: int) -> str:
    """
    Apply Binary Thresholding on the image.
    Converts image to grayscale first, then maps pixel values to 0 or 255.
    """
    gray = decode_base64(image_b64, cv2.IMREAD_GRAYSCALE)
    if gray is None:
        return ""
        
    _, thresh = cv2.threshold(gray, thresh_val, 255, cv2.THRESH_BINARY)
    return encode_base64(thresh)

def apply_edge_detection(image_b64: str, method: str, params: dict) -> str:
    """
    Apply mathematical edge detection using selected method.
    Methods: canny, sobel, prewitt, robert, laplacian, log
    """
    gray = decode_base64(image_b64, cv2.IMREAD_GRAYSCALE)
    if gray is None:
        return ""
        
    method = method.lower()
    
    if method == 'canny':
        low = params.get('low', 50)
        high = params.get('high', 150)
        edges = cv2.Canny(gray, low, high)
        
    elif method == 'sobel':
        grad_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
        grad_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
        abs_grad_x = cv2.convertScaleAbs(grad_x)
        abs_grad_y = cv2.convertScaleAbs(grad_y)
        edges = cv2.addWeighted(abs_grad_x, 0.5, abs_grad_y, 0.5, 0)
        
    elif method == 'prewitt':
        kernel_x = np.array([[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]], dtype=np.float32)
        kernel_y = np.array([[-1, -1, -1], [0, 0, 0], [1, 1, 1]], dtype=np.float32)
        grad_x = cv2.filter2D(gray, -1, kernel_x)
        grad_y = cv2.filter2D(gray, -1, kernel_y)
        edges = cv2.add(grad_x, grad_y)
        
    elif method == 'robert':
        kernel_x = np.array([[1, 0], [0, -1]], dtype=np.float32)
        kernel_y = np.array([[0, 1], [-1, 0]], dtype=np.float32)
        grad_x = cv2.filter2D(gray, -1, kernel_x)
        grad_y = cv2.filter2D(gray, -1, kernel_y)
        edges = cv2.add(cv2.convertScaleAbs(grad_x), cv2.convertScaleAbs(grad_y))
        
    elif method == 'laplacian':
        grad = cv2.Laplacian(gray, cv2.CV_64F, ksize=3)
        edges = cv2.convertScaleAbs(grad)
        
    elif method == 'log': # Laplacian of Gaussian
        # Apply Gaussian Blur first
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        # Apply Laplacian
        grad = cv2.Laplacian(blurred, cv2.CV_64F, ksize=3)
        edges = cv2.convertScaleAbs(grad)
        
    else:
        # Default fallback to Canny
        edges = cv2.Canny(gray, 50, 150)
        
    return encode_base64(edges)

def apply_morphology(image_b64: str, op: str, kernel_shape: str, kernel_size: int) -> str:
    """
    Apply mathematical morphology operators: Erosion or Dilation.
    Supported shapes: rectangle, cross, ellipse
    """
    img = decode_base64(image_b64)
    if img is None:
        return ""
        
    # Translate shape string to OpenCV enum
    shape_str = kernel_shape.lower()
    if shape_str == 'cross':
        shape_enum = cv2.MORPH_CROSS
    elif shape_str == 'ellipse':
        shape_enum = cv2.MORPH_ELLIPSE
    else:
        shape_enum = cv2.MORPH_RECT
        
    # Make sure kernel size is odd and valid
    if kernel_size % 2 == 0:
        kernel_size += 1
    kernel_size = max(1, kernel_size)
    
    # Generate structuring element
    element = cv2.getStructuringElement(shape_enum, (kernel_size, kernel_size))
    
    op = op.lower()
    if op == 'dilate':
        res = cv2.dilate(img, element)
    else: # erode
        res = cv2.erode(img, element)
        
    return encode_base64(res)

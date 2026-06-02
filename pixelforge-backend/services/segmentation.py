import cv2
import numpy as np
from utils.image_utils import decode_base64, encode_base64

def apply_threshold_segmentation(image_b64, threshold_val, mode='color'):
    """
    Perform threshold-based segmentation on the base64 image.
    mode 'binary' returns the binary mask.
    mode 'color' returns the original image masked with the binary mask.
    """
    img = decode_base64(image_b64)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply global binary thresholding
    _, mask = cv2.threshold(gray, threshold_val, 255, cv2.THRESH_BINARY)
    
    if mode == 'binary':
        # Convert single-channel mask back to 3 channels for display
        result = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)
    else:
        # Mask original color image
        result = cv2.bitwise_and(img, img, mask=mask)
        
    return encode_base64(result)

def apply_edge_segmentation(image_b64, low_thresh=50, high_thresh=150, mode='color'):
    """
    Perform edge-based segmentation using Canny and contour filling.
    mode 'binary' returns the binary contour mask.
    mode 'color' returns the original image masked with the contour mask.
    """
    img = decode_base64(image_b64)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Reduce noise with gaussian blur
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Detect edges
    edges = cv2.Canny(blurred, low_thresh, high_thresh)
    
    # Find contours
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Create blank mask
    mask = np.zeros_like(gray)
    
    # Draw filled contours on the mask
    cv2.drawContours(mask, contours, -1, 255, -1)
    
    if mode == 'binary':
        result = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)
    else:
        result = cv2.bitwise_and(img, img, mask=mask)
        
    return encode_base64(result)

def apply_region_segmentation(image_b64, num_clusters=3, target_cluster=None):
    """
    Perform region-based segmentation using K-Means clustering.
    If target_cluster is None, returns simplified clustered image.
    If target_cluster is an integer, extracts only that cluster.
    """
    img = decode_base64(image_b64)
    
    # Reshape image pixels to 2D float array
    pixel_values = img.reshape((-1, 3))
    pixel_values = np.float32(pixel_values)
    
    # Run K-Means
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.2)
    _, labels, centers = cv2.kmeans(pixel_values, num_clusters, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
    
    # Reconstruct clustered image
    centers = np.uint8(centers)
    labels = labels.flatten()
    
    if target_cluster is not None and 0 <= target_cluster < num_clusters:
        # Extract target cluster
        # Create a mask where only pixels of target_cluster are 255, others are 0
        mask = (labels == target_cluster).astype(np.uint8) * 255
        mask = mask.reshape(img.shape[:2])
        
        # Apply mask to original image
        result = cv2.bitwise_and(img, img, mask=mask)
    else:
        # Simplify colors of entire image to cluster centers
        segmented_image = centers[labels]
        result = segmented_image.reshape(img.shape)
        
    return encode_base64(result)

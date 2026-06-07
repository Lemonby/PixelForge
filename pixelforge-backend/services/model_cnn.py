import os
import cv2
import numpy as np
from utils.image_utils import decode_base64, encode_base64
from keras import models, layers

_model = None

def get_model():
    global _model
    if _model is None:
        # Reconstruct CNN architecture matching the exact layers and shape (100x100) from training
        model = models.Sequential([
            layers.Input(shape=(100, 100, 3)),
            
            # Layer 1
            layers.Conv2D(32, kernel_size=3, strides=1, activation='relu', padding='same', name='conv2d'),
            layers.MaxPooling2D(pool_size=(3, 3), strides=2, name='max_pooling2d'),
            
            # Layer 2
            layers.Conv2D(64, kernel_size=3, strides=1, activation='relu', padding='same', name='conv2d_1'),
            layers.MaxPooling2D(pool_size=(2, 2), strides=2, name='max_pooling2d_1'),
            
            # Layer 3
            layers.Conv2D(64, kernel_size=3, strides=1, activation='relu', padding='same', name='conv2d_2'),
            layers.MaxPooling2D(pool_size=(2, 2), strides=2, name='max_pooling2d_2'),
            
            # Layer 4
            layers.Conv2D(128, kernel_size=3, strides=1, activation='relu', padding='same', name='conv2d_3'),
            layers.MaxPooling2D(pool_size=(2, 2), strides=1, name='max_pooling2d_3'),
            
            # Classification Layers
            layers.Flatten(name='flatten'),
            layers.Dropout(0.5, name='dropout'),
            layers.Dense(512, activation='relu', name='dense'),
            layers.Dense(10, activation='softmax', name='dense_1')
        ])
        
        # Determine path of model weights in project
        backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        weights_path = os.path.join(backend_dir, 'models', 'model_simbol.weights.h5')
        
        if not os.path.exists(weights_path):
            raise FileNotFoundError(f"Model weights file not found at: {weights_path}")
            
        model.load_weights(weights_path)
        _model = model
    return _model

def predict_gesture(image_b64: str, overlay: bool = False) -> dict:
    """
    Decodes an image, resizes it to 100x100 (matching the training input shape),
    normalizes pixel values, predicts the hand gesture number (0-9), and
    returns prediction details. Optionally draws an overlay directly on the image.
    """
    # 1. Decode base64 image to CV2 BGR
    img = decode_base64(image_b64)
    h, w = img.shape[:2]
    
    # 2. Preprocess: Resize to 100x100 (matching training)
    img_resized = cv2.resize(img, (100, 100))
    
    # 3. Preprocess: Add batch dimension and scale to [0, 1]
    input_data = np.reshape(img_resized, [1, 100, 100, 3])
    input_data = input_data.astype(np.float32) / 255.0
    
    # 4. Predict
    model = get_model()
    probabilities = model.predict(input_data)
    predicted_class = int(np.argmax(probabilities, axis=1)[0])
    confidence = float(probabilities[0][predicted_class])
    
    result_image = image_b64
    
    # 5. Optional visual overlay
    if overlay:
        # Create a copy to prevent modifying the state image destructively
        img_overlay = img.copy()
        
        # Calculate dynamic text scaling and padding based on image dimensions
        font_scale = max(0.6, min(w, h) / 350.0)
        thickness = max(1, int(min(w, h) / 180.0))
        text = f"Prediksi: {predicted_class} ({confidence*100:.1f}%)"
        
        # Text and box coordinates
        (text_w, text_h), baseline = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, font_scale, thickness)
        margin = 15
        
        # Draw background rectangle for contrast
        box_coords = ((margin, margin), (margin + text_w + 12, margin + text_h + 10 + baseline))
        cv2.rectangle(img_overlay, box_coords[0], box_coords[1], (20, 20, 20), cv2.FILLED)
        
        # Draw text (Photoshop Blue #007acc -> BGR: (204, 122, 0))
        cv2.putText(
            img_overlay, 
            text, 
            (margin + 6, margin + text_h + 5), 
            cv2.FONT_HERSHEY_SIMPLEX, 
            font_scale, 
            (204, 122, 0), 
            thickness, 
            cv2.LINE_AA
        )
        
        result_image = encode_base64(img_overlay)
        
    return {
        "predicted_class": predicted_class,
        "confidence": confidence,
        "result_image": result_image
    }
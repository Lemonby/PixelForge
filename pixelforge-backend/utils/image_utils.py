import cv2
import numpy as np
import base64

def decode_base64(base64_str, flag=cv2.IMREAD_COLOR):
    try:
        if ',' in base64_str:
            base64_str = base64_str.split(',')[1]

        img_data = base64.b64decode(base64_str)

        nparr = np.frombuffer(img_data, np.uint8)

        img = cv2.imdecode(nparr, flag)

        if img is None:
            raise ValueError("Image decoding failed")

        return img

    except Exception as e:
        raise ValueError(f"Invalid base64 image: {e}")

def encode_base64(img, format='.png'):
    _, buffer = cv2.imencode(format, img)
    b64_str = base64.b64encode(buffer).decode('utf-8')
    return b64_str

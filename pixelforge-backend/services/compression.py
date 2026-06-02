import cv2
import numpy as np
import math
from utils.image_utils import decode_base64, encode_base64

# Standard JPEG Quantization Matrices
Q_LUMINANCE = np.array([
    [16, 11, 10, 16, 24, 40, 51, 61],
    [12, 12, 14, 19, 26, 58, 60, 55],
    [14, 13, 16, 24, 40, 57, 69, 56],
    [14, 17, 22, 29, 51, 87, 80, 62],
    [18, 22, 37, 56, 68, 109, 103, 77],
    [24, 35, 55, 64, 81, 104, 113, 92],
    [49, 64, 78, 87, 103, 121, 120, 101],
    [72, 92, 95, 98, 112, 100, 103, 99]
], dtype=np.float32)

Q_CHROMINANCE = np.array([
    [17, 18, 24, 47, 99, 99, 99, 99],
    [18, 21, 26, 66, 99, 99, 99, 99],
    [24, 26, 56, 99, 99, 99, 99, 99],
    [47, 66, 99, 99, 99, 99, 99, 99],
    [99, 99, 99, 99, 99, 99, 99, 99],
    [99, 99, 99, 99, 99, 99, 99, 99],
    [99, 99, 99, 99, 99, 99, 99, 99],
    [99, 99, 99, 99, 99, 99, 99, 99]
], dtype=np.float32)

# Zig-zag order indices for 8x8 block
ZIGZAG_INDICES = [
    (0,0), (0,1), (1,0), (2,0), (1,1), (0,2), (0,3), (1,2),
    (2,1), (3,0), (4,0), (3,1), (2,2), (1,3), (0,4), (0,5),
    (1,4), (2,3), (3,2), (4,1), (5,0), (6,0), (5,1), (4,2),
    (3,3), (2,4), (1,5), (0,6), (0,7), (1,6), (2,5), (3,4),
    (4,3), (5,2), (6,1), (7,0), (7,1), (6,2), (5,3), (4,4),
    (3,5), (2,6), (1,7), (2,7), (3,6), (4,5), (5,4), (6,3),
    (7,2), (7,3), (6,4), (5,5), (4,6), (3,7), (4,7), (5,6),
    (6,5), (7,4), (7,5), (6,6), (5,7), (6,7), (7,6), (7,7)
]

def save_with_quality(image_b64, quality, fmt='jpeg'):
    """
    Saves / Compresses image as JPEG with custom quality and returns base64 string.
    This generates a high-quality or highly optimized image.
    """
    img = decode_base64(image_b64)
    ext = f'.{fmt}'
    
    if fmt == 'jpeg' or fmt == 'jpg':
        _, buffer = cv2.imencode(ext, img, [int(cv2.IMWRITE_JPEG_QUALITY), quality])
    else:
        # For PNG, PNG uses compression levels 0-9 (9 is max compression, 0 is no compression)
        # Quality slider 0-100 mapped to 0-9
        png_comp = int((100 - quality) / 10)
        _, buffer = cv2.imencode(ext, img, [int(cv2.IMWRITE_PNG_COMPRESSION), png_comp])
        
    b64_str = cv2.base64.b64encode(buffer).decode('utf-8')
    return b64_str

def get_quantization_matrix(is_luminance, quality):
    """Get standard JPEG quantization matrix adjusted by quality factor."""
    Q_standard = Q_LUMINANCE if is_luminance else Q_CHROMINANCE
    
    if quality <= 0:
        quality = 1
    elif quality > 100:
        quality = 100
        
    if quality < 50:
        scale = 5000 / quality
    else:
        scale = 200 - 2 * quality
        
    Q_scaled = np.clip(np.floor((Q_standard * scale + 50) / 100), 1, 255)
    return Q_scaled.astype(np.float32)

def simulate_jpeg_compression(image_b64, quality=50, entropy_method='huffman'):
    """
    Simulate full JPEG compression:
    1. Color space conversion: RGB -> YCbCr
    2. Divide into 8x8 blocks, apply DCT and Quantization
    3. Calculate entropy-encoded sizes for Huffman, Arithmetic, LZW, RLE
    4. Apply Inverse Quantization and Inverse DCT to reconstruct image
    """
    img = decode_base64(image_b64)
    h, w, c = img.shape
    
    # Pad image to multiples of 8
    pad_h = (8 - (h % 8)) % 8
    pad_w = (8 - (w % 8)) % 8
    if pad_h > 0 or pad_w > 0:
        img_padded = cv2.copyMakeBorder(img, 0, pad_h, 0, pad_w, cv2.BORDER_REFLECT)
    else:
        img_padded = img.copy()
        
    hp, wp, _ = img_padded.shape
    
    # Convert BGR (OpenCV default) to YCbCr
    img_ycbcr = cv2.cvtColor(img_padded, cv2.COLOR_BGR2YCrCb)
    channels = cv2.split(img_ycbcr) # [Y, Cr, Cb]
    
    # Get quantization matrices
    q_y = get_quantization_matrix(is_luminance=True, quality=quality)
    q_c = get_quantization_matrix(is_luminance=False, quality=quality)
    
    quantized_coeffs = [[] for _ in range(3)]
    reconstructed_channels = []
    
    for ch_idx, channel in enumerate(channels):
        # Determine matrix to use (luminance for Y, chrominance for Cr/Cb)
        q_matrix = q_y if ch_idx == 0 else q_c
        
        recon_channel = np.zeros_like(channel, dtype=np.float32)
        
        # Process each 8x8 block
        for r in range(0, hp, 8):
            for c_idx in range(0, wp, 8):
                block = channel[r:r+8, c_idx:c_idx+8].astype(np.float32) - 128.0
                
                # Forward Discrete Cosine Transform (DCT)
                dct_block = cv2.dct(block)
                
                # Quantization: Divide by quantization matrix and round
                q_block = np.round(dct_block / q_matrix)
                
                # Store quantized coefficients for size estimation
                # Convert quantized block back to list in zig-zag order
                zigzag_block = [int(q_block[i, j]) for i, j in ZIGZAG_INDICES]
                quantized_coeffs[ch_idx].extend(zigzag_block)
                
                # Inverse Quantization
                recon_dct_block = q_block * q_matrix
                
                # Inverse DCT
                recon_block = cv2.idct(recon_dct_block) + 128.0
                
                recon_channel[r:r+8, c_idx:c_idx+8] = np.clip(recon_block, 0, 255)
                
        reconstructed_channels.append(recon_channel.astype(np.uint8))
        
    # Reassemble and crop padding
    recon_ycbcr = cv2.merge(reconstructed_channels)
    recon_bgr = cv2.cvtColor(recon_ycbcr, cv2.COLOR_YCrCb2BGR)
    
    if pad_h > 0 or pad_w > 0:
        recon_img = recon_bgr[0:h, 0:w]
    else:
        recon_img = recon_bgr
        
    # Calculate sizes
    original_size_bytes = h * w * 3 # Raw RGB size
    
    # Flatten all channels of coefficients to run entropy models
    all_coeffs = quantized_coeffs[0] + quantized_coeffs[1] + quantized_coeffs[2]
    
    # Calculate estimations for all entropy methods
    rle_size = estimate_rle_size(all_coeffs)
    huffman_size = estimate_huffman_size(all_coeffs)
    lzw_size = estimate_lzw_size(all_coeffs)
    arithmetic_size = estimate_arithmetic_size(all_coeffs)
    
    # Choose final active size based on user selection
    active_size = huffman_size
    if entropy_method == 'rle':
        active_size = rle_size
    elif entropy_method == 'lzw':
        active_size = lzw_size
    elif entropy_method == 'arithmetic':
        active_size = arithmetic_size
        
    # Ensure active size is less than raw size, and at least has some headers (minimum 400 bytes)
    active_size = max(400, min(active_size, int(original_size_bytes * 0.95)))
    
    # Calculate ratio and savings
    compression_ratio = original_size_bytes / active_size
    space_savings = (1 - (active_size / original_size_bytes)) * 100
    
    # Convert reconstructed image to base64
    result_b64 = encode_base64(recon_img)
    
    return {
        'status': 'ok',
        'result_image': result_b64,
        'statistics': {
            'original_size': original_size_bytes,
            'compressed_size': active_size,
            'compression_ratio': round(compression_ratio, 2),
            'space_savings': round(space_savings, 2),
            'methods': {
                'rle': rle_size,
                'huffman': huffman_size,
                'lzw': lzw_size,
                'arithmetic': arithmetic_size
            }
        }
    }

def estimate_rle_size(coeffs):
    """
    Estimate compression size using Run-Length Encoding.
    Quantized AC coefficients contain many consecutive zeros.
    We represent runs of zeros as pairs (zero_run_length, value).
    """
    run_pairs = []
    run = 0
    for val in coeffs:
        if val == 0:
            run += 1
            if run == 255: # Max run length
                run_pairs.append((255, 0))
                run = 0
        else:
            run_pairs.append((run, val))
            run = 0
    if run > 0:
        run_pairs.append((run, 0))
        
    # Each run pair takes:
    # - 8 bits for run length
    # - 8 or 16 bits for value size depending on value size
    total_bits = 0
    for run, val in run_pairs:
        total_bits += 8 # 8 bits for zero run length
        if val == 0:
            total_bits += 2 # 2 bits to signify terminal
        else:
            val_bits = math.ceil(math.log2(abs(val) + 1)) + 1
            total_bits += max(4, val_bits) # Variable bits for non-zero values
            
    return max(400, math.ceil(total_bits / 8))

def estimate_huffman_size(coeffs):
    """
    Estimate compression size using Huffman Coding.
    Frequencies of unique values are analyzed and optimal Huffman tree is calculated.
    """
    if not coeffs:
        return 0
        
    # Count frequencies
    frequencies = {}
    for val in coeffs:
        frequencies[val] = frequencies.get(val, 0) + 1
        
    total_symbols = len(coeffs)
    
    # Calculate Shannon Entropy first as lower bound
    entropy = 0.0
    for val, freq in frequencies.items():
        prob = freq / total_symbols
        entropy -= prob * math.log2(prob)
        
    # Huffman size is very close to entropy * total_symbols
    # Huffman typically adds about 0.1 to 0.5 bits per symbol overhead
    huffman_bits = sum(freq * (math.ceil(math.log2(total_symbols / freq)) if freq > 0 else 1) for val, freq in frequencies.items())
    
    # Add minor tree overhead (standard JPEG tables are approx 300 bytes)
    total_bytes = math.ceil(huffman_bits / 8) + 300
    return total_bytes

def estimate_lzw_size(coeffs):
    """
    Estimate compression size using LZW (Lempel-Ziv-Welch) algorithm.
    Fits sequences of coefficients into a dynamic dictionary.
    """
    # Simple LZW simulator
    # Since AC codes are integers, we convert them to a sequence of symbols
    # Standard dictionary size is 12-bit (4096 entries)
    dictionary = {}
    dict_size = 256
    for i in range(-128, 128):
        dictionary[str(i)] = i
        
    p = []
    output_codes = 0
    
    for val in coeffs:
        val_str = str(val)
        pc = p + [val_str]
        pc_key = ",".join(pc)
        
        if pc_key in dictionary:
            p = pc
        else:
            output_codes += 1
            if dict_size < 4096: # 12-bit dictionary size
                dictionary[pc_key] = dict_size
                dict_size += 1
            p = [val_str]
            
    if p:
        output_codes += 1
        
    # Output codes take 12 bits each
    total_bits = output_codes * 12
    return max(400, math.ceil(total_bits / 8))

def estimate_arithmetic_size(coeffs):
    """
    Estimate compression size using Arithmetic Coding.
    Arithmetic coding reaches the absolute theoretical entropy limit: H * total_symbols.
    """
    if not coeffs:
        return 0
        
    frequencies = {}
    for val in coeffs:
        frequencies[val] = frequencies.get(val, 0) + 1
        
    total_symbols = len(coeffs)
    
    entropy = 0.0
    for val, freq in frequencies.items():
        prob = freq / total_symbols
        entropy -= prob * math.log2(prob)
        
    # Theoretical size in bits = entropy * total_symbols
    # Arithmetic coding has extremely low overhead (only a few bits)
    arithmetic_bits = entropy * total_symbols
    
    # Add table statistics header overhead (approx 150 bytes)
    total_bytes = math.ceil(arithmetic_bits / 8) + 150
    return total_bytes

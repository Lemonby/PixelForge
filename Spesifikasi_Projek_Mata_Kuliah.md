Spesifikasi Projek Mata Kuliah  
Pengolahan Citra Digital 
 
Dosen Pengampu : Rizki Elisa Nalawati, S.T.,M.T. 
Deskripsi Sistem 
Mini Photoshop merupakan aplikasi pengolahan citra digital berbasis Python yang dirancang 
untuk mengimplementasikan konsep -konsep utama dalam mata kuliah Pengolahan Citra 
Digital, seperti enhancement, transformasi, filtering, segmentasi, dan manipulasi warna. 
Aplikasi ini memungkinkan pengguna melakukan pengolahan citra secara interaktif melalui 
antarmuka sederhana (GUI) 
Spesifikasi Fitur Sistem : 
1. Image Management 
Fungsi utama: 
 Load image (JPG, PNG, BMP) 
 Save image (custom filename & format) 
 Reset ke gambar awal 
Spesifikasi: 
 Input: file lokal 
 Output: file hasil edit 
 Preview: before–after panel 
2. Image Enhancement 
Fitur: 
 Brightness & Contrast Adjustment (slider)  
 Histogram Equalization  
 Sharpening  
 Smoothing (blur)  
3. Geometric Transformation 
Fitur: 
 Rotate (0°–360°)  
 Flip (horizontal/vertical)   Crop (drag area)  
 Resize (scaling)  
 Translation (geser posisi)  
Teknis: 
 Transformasi matriks affine  
 Interpolasi (nearest / bilinear)  
4. Image Restoration (Noise Reduction) 
Fitur: 
 Gaussian Blur  
 Median Filter  
 Noise removal (salt & pepper)  
Teknis: 
 Spatial filtering  
 Kernel convolution  
 
5. Binary & Edge Processing 
Fitur: 
 Thresholding (binary image)  
 Edge Detection:  
o Canny  
o Sobel  
o Prewitt 
o Robert 
o Laplacian 
o Laplacian of gaussian 
 Morphology:  
o Erosion  
o Dilation  
Teknis: 
 Operasi piksel biner  
 Kernel structuring element  
 6. Color Processing 
Fitur: 
 RGB → Grayscale  
 Channel splitting (R, G, B)  
 Color adjustment (hue/saturation sederhana)  
Teknis: 
 Transformasi ruang warna  
 Manipulasi channel array  
7.  Image Segmentation 
Fitur: 
 Threshold-based segmentation  
 Edge-based segmentation  
 Region-based sederhana  
Teknis: 
 Clustering sederhana / masking  
 Region extraction  
8. Image Compression 
Fitur: 
 Save dengan kualitas berbeda (low–high)  
 Simulasi kompresi JPEG  
Teknis: 
 Gunakan metode (Huffman, Aritmik, LZW , RLE,Metode Kuantisasi) 
9.  Histogram Analysis (Tambahan penting) 
Fitur: 
 Menampilkan histogram grayscale  
 Perbandingan histogram before–after  
Teknis: 
 Distribusi intensitas pixel  
 Visualisasi matplotlib  
10. User Interface (GUI) 
Fitur: 
 Menu toolbar (File, Edit, Filter, Transform)   Panel preview (before vs after)  
 Slider untuk parameter  
 Tombol aksi cepat 
11. Pengenalan Objek dengan Machine Learning (metode CNN) sebagai nilai tambah 
Pilih salah satu objek yg ingin di rekognisi misal manusia/hewan/ objek lainnya 
 
 
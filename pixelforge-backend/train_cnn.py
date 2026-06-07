# =====================================================================
# LANGKAH 1: IMPORT LIBRARY
# =====================================================================
import os
import numpy as np
import cv2
import matplotlib.pyplot as plt
from PIL import Image, ImageDraw, ImageFile

# Allow loading of truncated images to prevent OSError
ImageFile.LOAD_TRUNCATED_IMAGES = True

# Mengimpor modul Keras sesuai dengan struktur pada Jupyter Notebook kamu
import tensorflow as tf
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, Flatten, Dense, Dropout
# pyrefly: ignore [missing-import]
from tensorflow.keras.preprocessing.image import ImageDataGenerator

print("Menggunakan TensorFlow Versi:", tf.__version__)

# =====================================================================
# LANGKAH 2: PREPARE DATA (MENGGUNAKAN DATASET YANG DISEDIAKAN)
# =====================================================================
# Menggunakan dataset yang telah diekstrak di '/content/dataset_simbol_tangan'

# Define the base directory for the new dataset (menggunakan path absolut dinamis)
current_dir = os.path.dirname(os.path.abspath(__file__))
base_dir_new = os.path.join(current_dir, 'Dataset_Bentuk_Tangan')
train_dir = os.path.join(base_dir_new, 'train')
validation_dir = os.path.join(base_dir_new, 'validation')

# Check if the directories exist
if not os.path.exists(train_dir):
    print(f"[ERROR] Training directory not found: {train_dir}")
if not os.path.exists(validation_dir):
    print(f"[ERROR] Validation directory not found: {validation_dir}")

# Set target size (must match model input shape) and number of classes
target_size = (100, 100)
classes = 10 # Ada 10 classes yaitu angka 0-9

print(f"\n[INFO] Menggunakan dataset dari: {base_dir_new}")
print(f"\n[INFO] Menggunakan dataset train dari: {train_dir}")
print(f"\n[INFO] Menggunakan dataset validation dari: {validation_dir}\n")

# --- MEMULAI PROSES PREPARE DATA DENGAN IMAGEDATAGENERATOR ---
# Melakukan normalisasi nilai piksel (0-255) menjadi rentang (0.0-1.0)
train_datagen = ImageDataGenerator(rescale=1./255, zoom_range=0.1, horizontal_flip=False)
val_datagen = ImageDataGenerator(rescale=1./255)

train_generator = train_datagen.flow_from_directory(
    train_dir,
    target_size=target_size,
    shuffle=True,
    batch_size=32,
    color_mode='rgb',
    class_mode='categorical'
)


validation_generator = val_datagen.flow_from_directory(
    validation_dir,
    shuffle=False,
    target_size=target_size,
    batch_size=32,
    color_mode='rgb',
    class_mode='categorical'
)

# =====================================================================
# LANGKAH 3: CREATE MODEL
# =====================================================================
# Membangun arsitektur Sequential CNN berlapis
model = Sequential()

# Definisikan Input Shape menggunakan layer Input secara eksklisit
model.add(Input(shape=(100, 100, 3)))

# Lapisan Konvolusi Pertama (Feature Extraction)
model.add(Conv2D(32, kernel_size=3, strides=1, activation='relu', padding='same'))
model.add(MaxPooling2D(pool_size=(3, 3), strides=2))

# Lapisan Konvolusi Kedua
model.add(Conv2D(64, kernel_size=3, strides=1, activation='relu', padding='same'))
model.add(MaxPooling2D(pool_size=(2, 2), strides=2))

model.add(Conv2D(64, kernel_size=3, strides=1, activation='relu', padding='same'))
model.add(MaxPooling2D(pool_size=(2, 2), strides=2))

model.add(Conv2D(128, kernel_size=3, strides=1, activation='relu', padding='same'))
model.add(MaxPooling2D(pool_size=(2, 2), strides=1))

# Lapisan Flattening (Mengubah matriks 3D menjadi Vektor 1D)
model.add(Flatten())

# Lapisan Fully Connected (Classification)
model.add(Dropout(0.5))                   # Dropout untuk mencegah overfitting
model.add(Dense(512, activation='relu')) # Hidden Layer 1
model.add(Dense(classes, activation='softmax')) # Output Layer

# Menampilkan rangkuman arsitektur jaringan saraf di terminal
model.summary()


# =====================================================================
# LANGKAH 4: COMPILE MODEL
# =====================================================================
# Menentukan fungsi loss, optimizer, dan metrik penilaian performa
model.compile(
    optimizer='adam',                         # Adam optimizer sangat populer & cepat
    loss='categorical_crossentropy',               #
    metrics=['accuracy']                      # Mengukur performa menggunakan akurasi
)

# =====================================================================
# LANGKAH TAMBAHAN: MELATIH MODEL (TRAINING)
# =====================================================================
print("\n[INFO] Memulai proses training model...")
history = model.fit(
    train_generator,
    steps_per_epoch=train_generator.samples // train_generator.batch_size, # Use actual number of steps
    epochs=5,                                # Melatih sebanyak 5 kali putaran (epoch)
    validation_data=validation_generator,
    validation_steps=validation_generator.samples // validation_generator.batch_size
)


# =====================================================================
# LANGKAH 5: SAVE MODEL
# =====================================================================
# Menentukan folder model
models_dir = os.path.join(current_dir, 'models')
os.makedirs(models_dir, exist_ok=True)

# Menyimpan seluruh arsitektur, bobot (weights), dan konfigurasi model
model_json=model.to_json()
model_path=os.path.join(models_dir, "model_simbol.json")
with open(model_path, "w") as json_file:
    json_file.write(model_json)

# Menyimpan bobot (weights) model
weights_path=os.path.join(models_dir, "model_simbol.weights.h5")
model.save_weights(weights_path)

print(f"\n[INFO] Model berhasil disimpan di: {model_path} dan {weights_path}")

# =====================================================================
# EVALUATE / TESTING
# =====================================================================
from keras.models import model_from_json
json_file = open(model_path, "r")
loaded_model_json = json_file.read()
json_file.close()

loaded_model = model_from_json(loaded_model_json)
loaded_model.load_weights(weights_path)
print("FILE LOADED")

test_img_path = os.path.join(base_dir_new, 'Examples', 'example_9.JPG')
if not os.path.exists(test_img_path):
    test_img_path = os.path.join(base_dir_new, 'examples', 'example_9.JPG')
image = cv2.imread(test_img_path)
image = cv2.resize(image, (100, 100))
image = np.reshape(image, [1, 100, 100, 3]) # Changed to add batch dimension
image = image / 255.0 # Normalize pixel values to 0-1 range, assuming the model was trained with normalized inputs

# Get probability predictions
probabilities = loaded_model.predict(image)
# Get the predicted class by finding the index with the highest probability
predicted_class_index = np.argmax(probabilities, axis=1)[0]

print("prediksinya adalah angka", predicted_class_index)

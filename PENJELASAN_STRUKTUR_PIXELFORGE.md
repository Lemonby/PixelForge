# Penjelasan Detail Struktur Proyek PixelForge

## 📋 Ringkasan Umum

PixelForge adalah aplikasi web full-stack untuk **pengolahan dan manipulasi gambar secara real-time** dengan antarmuka modern yang futuristik (cyberpunk style). Aplikasi ini terdiri dari dua bagian utama:

- **Backend**: Python Flask API untuk pemrosesan gambar menggunakan OpenCV
- **Frontend**: React + Vite dengan styling Tailwind CSS dan animasi Framer Motion

---

## 🏗️ STRUKTUR ARSITEKTUR

```
Frontend (React) ←→ HTTP/API ←→ Backend (Flask/Python)
    ↓                                    ↓
- UI Components          - Image Processing
- State Management       - OpenCV Operations
- Controllers            - Base64 Encoding/Decoding
- Models                 - Image Enhancement
- Services (API)         - Geometric Transformations
```

---

# 📁 PENJELASAN FILE FRONTEND (React)

## 1. Configuration Files (File Konfigurasi)

### **`package.json`**
**Fungsi**: Metadata proyek dan dependency management Node.js

**Isi penting**:
- **Dependencies**: Library yang dibutuhkan untuk development dan production
- **Scripts**: Perintah untuk menjalankan dev server, build, lint, dll

**Dependencies kunci**:
```json
{
  "react": "UI library utama",
  "react-dom": "Render React ke DOM",
  "react-router-dom": "Routing antar halaman",
  "zustand": "State management (lebih ringan dari Redux)",
  "axios": "HTTP client untuk API calls",
  "framer-motion": "Animasi smooth dan interaktif",
  "tailwindcss": "CSS utility framework",
  "@tailwindcss/vite": "Integrasi Tailwind dengan Vite",
  "@radix-ui/react-slider": "Unstyled slider component",
  "lucide-react": "Icon library modern",
  "react-easy-crop": "Image cropping tool",
  "recharts": "Charting library untuk visualisasi"
}
```

---

### **`vite.config.js`**
**Fungsi**: Konfigurasi build tool Vite (pengganti Webpack)

**Apa yang dilakukan**:
- Mengkonfigurasi React plugin (`@vitejs/plugin-react`)
- Mengkonfigurasi Tailwind CSS plugin (`@tailwindcss/vite`)
- Mengoptimalkan build untuk production

**Keuntungan Vite**:
- Lightning-fast development server (HMR - Hot Module Replacement)
- Lebih cepat dari Webpack
- Build yang optimal dengan tree-shaking

---

### **`eslint.config.js`**
**Fungsi**: Konfigurasi linter untuk menjaga kualitas kode

**Apa yang diatur**:
- ESLint recommended rules
- React Hooks plugin (memastikan hooks digunakan dengan benar)
- React Refresh plugin (untuk Vite)

---

## 2. Styling Files (File Styling)

### **`src/index.css`**
**Fungsi**: Global stylesheet utama dengan Tailwind CSS dan custom theme

**Komponen utama**:

1. **Theme Colors** (Cyberpunk color scheme):
   ```css
   --color-cyber-bg: #050b14 (background gelap)
   --color-cyber-cyan: #00f0ff (biru neon)
   --color-cyber-purple: #8a2be2 (ungu)
   --color-cyber-pink: #ff003c (merah muda)
   --color-cyber-green: #00ff66 (hijau neon)
   ```

2. **Glassmorphism Effects**:
   - `.glass` - efek glass blur dengan transparency
   - `.glass-panel` - panel dengan backdrop blur
   - `.glass-button` - tombol dengan efek glass

3. **Background Effects**:
   - `body` - radial gradient dengan glow cyan dan purple
   - `.orb-1` dan `.orb-2` - floating orbs dengan animasi (backdrop effect)

4. **Scrollbar Styling**:
   - Custom scrollbar dengan warna cyber-cyan/purple

---

### **`src/App.css`**
**Fungsi**: Styling spesifik untuk komponen App (legacy styling)

**Catatan**: File ini sebagian besar digantikan oleh Tailwind CSS dalam implementasi modern

---

## 3. Entry Point Files

### **`src/main.jsx`**
**Fungsi**: Entry point utama React application

**Alur kerja**:
```jsx
1. Import React dan ReactDOM
2. Import global styles (index.css)
3. Import App component
4. Cari elemen HTML dengan id="root" (dari index.html)
5. Render App component ke dalam root element
6. Wrap dengan StrictMode untuk development checks
```

**Keamanan Mode Strict**:
- Deteksi efek samping yang tidak terduga
- Membantu mendeteksi bugs dalam development

---

### **`src/App.jsx`**
**Fungsi**: Root component yang mengatur routing aplikasi

**Struktur**:
```jsx
- BrowserRouter: Menyediakan routing context
- Routes: Container untuk route definitions
- Route 1: "/" → HomePage (landing page)
- Route 2: "/editor" → EditorPage (main editor)
```

**Fungsi setiap route**:
- `/` = Halaman utama dengan fitur showcase
- `/editor` = Workspace editor untuk manipulasi gambar

---

## 4. Core Model (State Management)

### **`src/models/imageModel.js`**
**Fungsi**: Central state store menggunakan Zustand untuk manajemen state aplikasi

**State yang dikelola**:
```javascript
{
  originalImage: null,      // Gambar original (base64)
  currentImage: null,       // Gambar saat ini (setelah edit)
  isProcessing: false,      // Flag loading
  history: [],              // Array riwayat semua edits
  historyIndex: -1          // Posisi dalam history (untuk undo/redo)
}
```

**Methods (Fungsi-fungsi)**:

1. **`setInitialImage(base64)`**
   - Set gambar awal dari upload
   - Initialize history dengan 1 item (gambar original)
   - Set historyIndex ke 0

2. **`setResultImage(base64)`**
   - Add hasil edit ke history
   - Increment historyIndex
   - Jika user melakukan edit setelah undo, history yang sebelumnya dihapus

3. **`stepBack()`**
   - Undo: Kurangi historyIndex dan set currentImage ke versi sebelumnya
   - Hanya bisa jika historyIndex > 0

4. **`stepForward()`**
   - Redo: Naikkan historyIndex dan set currentImage ke versi berikutnya
   - Hanya bisa jika historyIndex < history.length

5. **`resetToOriginal()`**
   - Reset ke gambar original
   - Memanggil setResultImage dengan originalImage

6. **`setProcessingState(status)`**
   - Set/update flag processing untuk show loading spinner

**Mengapa Zustand?**
- Lebih ringan dan simple dibanding Redux
- Hook-based API (mirip useState)
- Direct state mutation tidak diperlukan

---

## 5. Services (API Communication)

### **`src/services/api.js`**
**Fungsi**: HTTP client wrapper untuk komunikasi dengan backend

**Konfigurasi**:
```javascript
- baseURL: "http://127.0.0.1:5000" (Flask backend local)
- Header: "Content-Type: application/json"
```

**Penggunaan**:
```javascript
// Mengirim gambar ke backend untuk processing
api.post("/api/enhancement/brightness", {
  image: base64String,
  value: 50
})
```

**Alur data**:
1. Frontend mengirim gambar (base64) + parameter ke API
2. Backend memproses dengan OpenCV
3. Backend mengembalikan gambar hasil (base64)
4. Frontend menampilkan hasil ke canvas

---

## 6. Controllers (Business Logic)

### **`src/controllers/editorController.js`**
**Fungsi**: Controller yang menghubungkan UI Components dengan Model dan Services

**Methods yang disediakan**:

1. **`handleFileUpload(file)`**
   - Ketika user upload gambar:
   - Read file menggunakan FileReader API
   - Convert ke base64
   - Simpan ke model dengan `setInitialImage()`
   - Gambar siap diproses

2. **`handleDownload()`**
   - Ketika user klik "Export":
   - Ambil currentImage dari model
   - Create blob URL dengan data URL
   - Trigger browser download
   - Nama file: "pixelforge-premium.png"

3. **`applyProcess(endpoint, payload)`**
   - Fungsi utama untuk apply semua effect:
   - Set `isProcessing = true` (show spinner)
   - POST ke backend dengan endpoint dan parameter
   - Tunggu response dengan gambar hasil
   - Set hasil ke model dengan `setResultImage()`
   - Otomatis di-track dalam history
   - Set `isProcessing = false` (hide spinner)

**Contoh penggunaan**:
```javascript
// Apply brightness
applyProcess("/api/enhancement/brightness", { value: 50 })

// Apply transform rotate
applyProcess("/api/transform/rotate", { angle: 90 })
```

---

## 7. Views - Pages (Halaman Utama)

### **`src/views/pages/HomePage.jsx`**
**Fungsi**: Landing page / halaman selamat datang aplikasi

**Struktur layout**:
1. **Navigation Bar** (sticky):
   - Logo PixelForge dengan hover rotation animation
   - Links ke features dan engine
   - "Launch Core" button untuk ke editor

2. **Hero Section**:
   - Badge: "Next-Gen Neural Processing"
   - Headline: "Forge Your Perfect Pixels"
   - Subheading: Deskripsi tentang PixelForge
   - 2 CTA Buttons:
     - "Initialize Studio" (primary - ke editor)
     - "View Documentation" (secondary)

3. **Feature Cards Grid** (3 columns):
   - Card 1: Real-Time Core (⚡ Zap icon)
   - Card 2: Spatial Filtering (🖼️ Image icon)
   - Card 3: Premium Glass UX (✨ Sparkles icon)

**Animasi & Effects**:
- Framer Motion animations (stagger, spring timing)
- Glassmorphism panels
- Gradient text dengan animation
- Hover effects pada cards (scale, shadow)
- Background orbs yang floating
- Grid pattern overlay

**User Flow**:
User masuk → Lihat showcase → Klik "Initialize Studio" → Go to EditorPage

---

### **`src/views/pages/EditorPage.jsx`**
**Fungsi**: Main workspace untuk editing gambar

**Layout Structure** (3 bagian):
```
┌─────────────────────────────────────────┐
│ TopBar (Header dengan controls)          │
├──────────────┬──────────────────────────┤
│              │                          │
│ FilterPanel  │ ImageCanvas              │
│  (Sidebar)   │ (Preview area)           │
│              │                          │
└──────────────┴──────────────────────────┘
```

**Komponen**:
- **TopBar**: File upload, download, undo/redo, reset
- **FilterPanel**: Slider controls dan tombol effect
- **ImageCanvas**: Preview gambar hasil editing

**Background Effects**:
- Ambient orbs (glassmorphism effect)
- Z-index layering untuk proper rendering

---

## 8. Views - Components (Komponen UI Reusable)

### **`src/views/components/TopBar.jsx`**
**Fungsi**: Header toolbar dengan kontrol utama

**Elemen**:
1. **Logo Section**:
   - "PF" badge dengan gradient (cyan-purple)
   - Teks "PIXELFORGE" dengan subtitle "Studio Edition"

2. **Control Buttons Group**:
   ```
   [Upload] | [Undo] [Redo] | [Reset] | [Export]
   ```

3. **Functional Buttons**:
   - **Upload** (`Upload` icon):
     - Trigger file input
     - Call `handleFileUpload()`
   
   - **Undo** (`Undo` icon):
     - Call `stepBack()`
     - Disabled jika historyIndex = 0
   
   - **Redo** (`Redo` icon):
     - Call `stepForward()`
     - Disabled jika sudah di akhir history
   
   - **Reset** (`RotateCcw` icon - cyber pink):
     - Call `resetToOriginal()`
     - Disabled jika tidak ada gambar
   
   - **Export** (`Download` icon):
     - Call `handleDownload()`
     - Disabled jika tidak ada gambar

**Styling**:
- Glass panel dengan glassmorphism
- Dark theme dengan cyber colors
- Hover effects pada buttons

---

### **`src/views/components/FilterPanel.jsx`**
**Fungsi**: Sidebar panel dengan semua tools untuk effect dan filtering

**Layout**:
```
┌──────────────────────────┐
│  Empty State (no image)  │  ← Jika belum upload
└──────────────────────────┘

┌──────────────────────────┐
│ ENHANCEMENTS             │
│ - Brightness slider      │
│ - Contrast slider        │
│ - [Auto Enhance] button  │
│ - [Sharpen] button       │
│ - [Smooth/Blur] button   │
├──────────────────────────┤
│ TRANSFORM                │
│ - [Rotate -90°]          │
│ - [Rotate +90°]          │
│ - [Flip Horizontal]      │
│ - [Flip Vertical]        │
├──────────────────────────┤
│ [Processing Spinner]     │  ← Saat request API
└──────────────────────────┘
```

**Enhancement Section**:
1. **Brightness Slider** (-100 to +100):
   - Live preview saat di-drag
   - Call `applyProcess()` dengan endpoint `/api/enhancement/brightness`

2. **Contrast Slider** (-100 to +100):
   - Adjust contrast dinamis
   - Endpoint: `/api/enhancement/contrast`

3. **Auto Enhance Button**:
   - Histogram equalization untuk auto-enhance
   - Endpoint: `/api/enhancement/histogram-eq`

4. **Sharpen Button**:
   - Increase sharpness/clarity
   - Endpoint: `/api/enhancement/sharpen`

5. **Smooth/Blur Button**:
   - Gaussian blur untuk smooth
   - Endpoint: `/api/enhancement/smooth`

**Transform Section**:
1. **Rotate Buttons** (±90°):
   - Rotate left/right
   - Endpoint: `/api/transform/rotate`

2. **Flip Buttons** (H/V):
   - Flip horizontal/vertical
   - Endpoint: `/api/transform/flip`

**Processing Overlay**:
- Backdrop blur overlay saat `isProcessing = true`
- Spinner animation dengan loading text

**Empty State**:
- Jika `currentImage = null`:
- Show placeholder image icon
- Teks: "Please upload an image..."

---

### **`src/views/components/ImageCanvas.jsx`**
**Fungsi**: Canvas area untuk preview gambar hasil editing

**Layout**:
```
Jika tidak ada gambar:
┌──────────────────────────────┐
│  Decorative grid background  │
│  Animated circles (loader)   │
│  "Forge Your Vision"         │
│  Subtitle text               │
└──────────────────────────────┘

Jika ada gambar:
┌──────────────────────────────┐
│  Checkerboard pattern        │
│  [    PREVIEW IMAGE    ]     │
│  (max-width, max-height)     │
│  With drop shadow            │
└──────────────────────────────┘
```

**Features**:
1. **Empty State Display**:
   - Grid background pattern
   - Animated loading circles (dual concentric)
   - Motivational text: "Forge Your Vision"

2. **Image Display**:
   - Render base64 image dengan `<img>` tag
   - `max-w-full max-h-full object-contain` untuk responsive
   - Drop shadow untuk depth
   - Rounded corners

3. **Background Effects**:
   - Checkerboard pattern (indicates transparency)
   - Subtle overlay untuk depth

---

### **`src/views/components/SliderControl.jsx`**
**Fungsi**: Reusable slider component untuk brightness, contrast, dll

**Props**:
```javascript
{
  label: "Brightness",           // Label text
  min: -100,                      // Minimum value
  max: 100,                       // Maximum value
  step: 1,                        // Step increment
  defaultValue: 0,                // Initial value
  onChange: (value) => {}         // Callback saat value berubah
}
```

**Struktur**:
```
┌─────────────────────────────┐
│ Brightness              [50] │  ← Label dan value display
├─────────────────────────────┤
│ ░░●░░░░░░░░░░░░░░░░░░░░░░░░░ │  ← Slider track dengan gradient
└─────────────────────────────┘
```

**Komponen**:
1. **Label Section**:
   - Text label (left)
   - Value display (right) - badge dengan mono font

2. **Radix UI Slider**:
   - Smooth interaction
   - Track: white/10 background dengan gradient range
   - Thumb: white dengan hover scale effect
   - Focus ring: cyber-cyan glow

3. **Callback Behavior**:
   - `onValueChange`: Real-time state update (untuk preview visual)
   - `onPointerUp`: Trigger API call saat slider release
   - Ini membuat UX lebih smooth (tidak spam API calls)

---

## 9. HTML Structure

### **`index.html`**
**Fungsi**: Root HTML template

**Key Elements**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Meta tags untuk responsive, charset, dll -->
</head>
<body>
  <div id="root"></div>  <!-- React akan render di sini -->
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

---

# 🔌 PENJELASAN FILE BACKEND (Python/Flask)

## Overview Backend Architecture

Backend menggunakan **Flask** (micro web framework) dengan **OpenCV** (image processing library) untuk melakukan semua operasi pengolahan gambar.

---

## Backend Files

### **`app.py`**
**Fungsi**: Flask application factory dan setup utama

**Struktur**:
```python
def create_app():
    - Buat Flask instance
    - Enable CORS (Cross-Origin Resource Sharing) untuk komunikasi dengan frontend
    - Set MAX_CONTENT_LENGTH = 50MB (limit ukuran upload)
    - Register 3 blueprints (routes):
      1. /api/image - Image operations
      2. /api/enhancement - Enhancement filters
      3. /api/transform - Geometric transformations
    - Define "/" endpoint untuk health check

if __name__ == '__main__':
    - Run app di localhost:5000 dengan debug=True
```

**CORS**:
- Memungkinkan request dari frontend (localhost:5173 Vite dev server)
- Tanpa ini, browser akan block CORS requests

---

### **`requirements.txt`**
**Fungsi**: List semua Python dependencies

**Packages**:
```
Flask - Web framework
Flask-Cors - CORS support
opencv-python-headless - Image processing (headless = no GUI)
Pillow - Image library backup
numpy - Array operations
scipy - Scientific computing
matplotlib - Plotting (optional)
python-dotenv - Environment variables
```

---

### **`routes/enhancement_routes.py`**
**Fungsi**: API endpoints untuk image enhancement effects

**Endpoints**:

1. **POST `/api/enhancement/brightness`**
   - Param: `image` (base64), `value` (int -100 to +100)
   - Call: `adjust_brightness(image, value)`

2. **POST `/api/enhancement/contrast`**
   - Param: `image`, `value`
   - Call: `adjust_contrast(image, value)`

3. **POST `/api/enhancement/histogram-eq`**
   - Param: `image`
   - Call: `histogram_equalization(image)`
   - Auto-enhance dengan histogram equalization

4. **POST `/api/enhancement/sharpen`**
   - Param: `image`, `level`
   - Call: `sharpen(image, level)`

5. **POST `/api/enhancement/smooth`**
   - Param: `image`, `level`
   - Call: `smooth(image, level)`
   - Gaussian blur

---

### **`routes/transform_routes.py`**
**Fungsi**: API endpoints untuk geometric transformations

**Endpoints**:

1. **POST `/api/transform/rotate`**
   - Param: `image`, `angle` (derajat)
   - Call: `rotate(image, angle)`

2. **POST `/api/transform/flip`**
   - Param: `image`, `direction` ('h' atau 'v')
   - Call: `flip(image, direction)`

3. **POST `/api/transform/crop`**
   - Param: `image`, `x`, `y`, `w`, `h`
   - Call: `crop(image, x, y, w, h)`

4. **POST `/api/transform/resize`**
   - Param: `image`, `width`, `height`
   - Call: `resize(image, width, height)`

5. **POST `/api/transform/translate`**
   - Param: `image`, `tx`, `ty` (translation offset)
   - Call: `translate(image, tx, ty)`

---

### **`services/enhancement.py`**
**Fungsi**: Implementasi semua enhancement algorithms menggunakan OpenCV

**Algorithms**:

1. **`adjust_brightness(image_b64, value)`**
   - Decode base64 → numpy array
   - Add value ke setiap pixel (value bisa negatif)
   - Clip ke range [0, 255] (valid pixel values)
   - Encode kembali ke base64
   - Formula: `img + value`

2. **`adjust_contrast(image_b64, value)`**
   - Formula: `f = 131 * (value + 127) / (127 * (131 - value))`
   - Gunakan `cv2.addWeighted()` dengan alpha dan gamma correction
   - Lebih sophisticated daripada simple brightness

3. **`histogram_equalization(image_b64)`**
   - Convert BGR → YUV color space
   - Apply histogram equalization ke Y channel (luminance)
   - Convert kembali ke BGR
   - Result: Contrast yang lebih baik dengan detail lebih jelas

4. **`sharpen(image_b64, level)`**
   - Gunakan kernel convolution:
     ```
     [-1 -1 -1]
     [-1  9 -1]
     [-1 -1 -1]
     ```
   - Adjust kernel intensity based on level parameter
   - Apply dengan `cv2.filter2D()`

5. **`smooth(image_b64, level)`**
   - Gaussian blur dengan kernel size: `(level*2+1, level*2+1)`
   - Level tinggi = blur lebih besar
   - Formula: `cv2.GaussianBlur(img, (k, k), 0)`

---

### **`services/geometric.py`**
**Fungsi**: Implementasi geometric transformations

**Algorithms**:

1. **`rotate(image_b64, angle)`**
   - Get rotation matrix: `cv2.getRotationMatrix2D((center_x, center_y), angle, scale=1)`
   - Apply dengan `cv2.warpAffine()`
   - Rotate around image center

2. **`flip(image_b64, direction)`**
   - `flip_code = 1` untuk horizontal
   - `flip_code = 0` untuk vertical
   - `cv2.flip(img, flip_code)`

3. **`crop(image_b64, x, y, w, h)`**
   - Simple array slicing: `img[y:y+h, x:x+w]`
   - Array indexing [row, col]

4. **`resize(image_b64, width, height)`**
   - `cv2.resize(img, (width, height))`
   - Automatic interpolation

5. **`translate(image_b64, tx, ty)`**
   - Create translation matrix:
     ```
     [1  0  tx]
     [0  1  ty]
     ```
   - Apply dengan `cv2.warpAffine()`

---

### **`utils/image_utils.py`**
**Fungsi**: Utility functions untuk encode/decode base64 images

**Functions**:

1. **`decode_base64(base64_str)`**
   - Handle data URL format: `data:image/jpeg;base64,xxxxx`
   - Split di koma, ambil bagian setelah koma
   - Decode base64 string → bytes
   - Convert bytes → numpy array
   - Decode array → CV2 image matrix

2. **`encode_base64(img, format='.png')`**
   - Encode CV2 image matrix → PNG bytes dengan `cv2.imencode()`
   - Encode bytes → base64 string
   - Return base64 string untuk dikirim ke frontend

**Flow data**:
```
Frontend (Base64) 
   ↓
decode_base64() → OpenCV Image Matrix (numpy array)
   ↓
Process dengan OpenCV
   ↓
encode_base64() → Base64 String
   ↓
Backend send response → Frontend receives
```

---

# 🔄 ALUR DATA LENGKAP (End-to-End)

## Scenario: User Upload dan Apply Brightness

```
1. USER ACTION
   └─→ Click upload button
       └─→ Select image file

2. FRONTEND - TOPBAR COMPONENT
   └─→ handleFileUpload(file) called
       ├─→ Read file dengan FileReader API
       ├─→ Convert ke Base64
       └─→ Call model.setInitialImage(base64)

3. STATE MANAGEMENT (imageModel.js)
   └─→ setInitialImage(base64)
       ├─→ Set originalImage = base64
       ├─→ Set currentImage = base64
       ├─→ Set history = [base64]
       ├─→ Set historyIndex = 0
       └─→ Trigger re-render components

4. IMAGE CANVAS UPDATES
   └─→ <img src={`data:image/png;base64,${currentImage}`} />
       └─→ Display preview image

5. FILTER PANEL BECOMES ACTIVE
   └─→ Show brightness slider dan other controls

6. USER ADJUSTS BRIGHTNESS SLIDER
   └─→ setValue([50]) (internal state)
   └─→ Preview real-time (tidak perlu API call)

7. USER RELEASES SLIDER
   └─→ onPointerUp trigger
   └─→ applyProcess("/api/enhancement/brightness", { value: 50 })

8. CONTROLLER - APPLY PROCESS
   └─→ setProcessingState(true)  // Show spinner
   └─→ api.post("/api/enhancement/brightness", {
           image: currentImage (base64),
           value: 50
       })

9. FRONTEND SENDS TO BACKEND
   └─→ HTTP POST request to localhost:5000/api/enhancement/brightness
       └─→ Body: JSON { image: "base64...", value: 50 }

10. BACKEND - ENHANCEMENT ROUTES
    └─→ @enhancement_bp.route('/brightness')
        ├─→ Extract data['image'] dan data['value']
        ├─→ Call adjust_brightness(image, 50)
        └─→ Return JSON response

11. BACKEND - ENHANCEMENT SERVICE
    └─→ adjust_brightness(image_b64, 50)
        ├─→ img = decode_base64(image_b64)
        │   └─→ Convert base64 → numpy array
        ├─→ img = np.clip(img + 50, 0, 255)
        │   └─→ Add 50 ke setiap pixel, clip ke [0,255]
        ├─→ result = encode_base64(img)
        │   └─→ Convert array → base64
        └─→ Return base64 string

12. BACKEND RESPONSE
    └─→ { status: 'ok', result_image: 'base64...' }

13. FRONTEND RECEIVES RESPONSE
    └─→ axios .then()
        ├─→ Extract res.data.result_image
        ├─→ Call model.setResultImage(result_image)
        └─→ setProcessingState(false)  // Hide spinner

14. STATE UPDATES
    └─→ setResultImage(result_image)
        ├─→ Slice history sampai current index
        ├─→ currentImage = result_image
        ├─→ history = [...newHistory, result_image]
        ├─→ historyIndex = newHistory.length
        └─→ Trigger re-render

15. IMAGE CANVAS RE-RENDERS
    └─→ <img src={`data:image/png;base64,${currentImage}`} />
        └─→ Show updated image dengan brightness +50

16. HISTORY STACK
    └─→ [originalImage, brightImage_50]
    └─→ historyIndex = 1
    └─→ Undo button become enabled
```

---

## Contoh Complex Flow: Undo/Redo

```
History: [img0, img50, img100]
historyIndex: 2 (currently at img100)

USER CLICKS UNDO
↓
stepBack()
├─→ historyIndex: 2 → 1
├─→ currentImage = history[1] = img50
└─→ Re-render: show img50

USER CLICKS UNDO AGAIN
↓
stepBack()
├─→ historyIndex: 1 → 0
├─→ currentImage = history[0] = img0
└─→ Re-render: show img0

USER APPLIES BRIGHTNESS +30
↓
setResultImage(img30)
├─→ newHistory = history.slice(0, 0+1) = [img0]
├─→ history = [img0, img30]  ← img50 dan img100 dihapus!
├─→ historyIndex = 1
└─→ Re-render: show img30

HISTORY TREE (linear):
[img0] → [img50] → [img100]  ← Previous branch
[img0] → [img30]              ← New branch (after edit from undo)
```

---

# 📊 TECHNOLOGY STACK SUMMARY

## Frontend Stack
| Technology | Fungsi |
|-----------|--------|
| **React 19** | UI framework |
| **Vite** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first CSS |
| **Zustand** | State management |
| **Axios** | HTTP client |
| **Framer Motion** | Animations |
| **Lucide React** | Icons |
| **Radix UI** | Unstyled components |
| **React Router v7** | Routing |

## Backend Stack
| Technology | Fungsi |
|-----------|--------|
| **Flask** | Web framework |
| **OpenCV** | Image processing |
| **NumPy** | Array operations |
| **Pillow** | Image library |
| **SciPy** | Scientific computing |

---

# 🎨 Design Pattern & Architecture

## Frontend Architecture Pattern: MVC

```
Model (imageModel.js)
├─→ Central state store
├─→ Business logic (undo/redo)
└─→ No UI concerns

View (components & pages)
├─→ TopBar.jsx
├─→ FilterPanel.jsx
├─→ ImageCanvas.jsx
├─→ SliderControl.jsx
├─→ HomePage.jsx
├─→ EditorPage.jsx
└─→ Display logic only

Controller (editorController.js)
├─→ Connect View to Model
├─→ Handle user interactions
├─→ Call API services
└─→ Business logic orchestration
```

## Backend Architecture Pattern: Service Layer

```
Routes (API endpoints)
    ↓
Services (enhancement.py, geometric.py)
├─→ Pure algorithms
├─→ No HTTP concerns
└─→ Reusable functions
    ↓
Utils (image_utils.py)
├─→ Base64 encoding/decoding
├─→ Helper functions
└─→ Shared utilities
```

---

# ⚡ Performance Optimizations

## Frontend
1. **Lazy slider API calls**: hanya call API saat pointer up, bukan setiap move
2. **Component memoization**: Prevent unnecessary re-renders
3. **Code splitting**: Routes lazy loaded dengan React Router
4. **Vite fast HMR**: Hot module replacement untuk fast development

## Backend
1. **OpenCV optimized operations**: C++ bindings untuk speed
2. **Base64 compression**: Efficient data transfer
3. **Numpy operations**: Vectorized (tidak loop per pixel)
4. **Flask lightweight**: Minimal overhead

---

# 🚀 How to Run

## Frontend
```bash
cd pixelforge-frontend
npm install
npm run dev        # Start dev server (localhost:5173)
```

## Backend
```bash
cd pixelforge-backend
pip install -r requirements.txt
python app.py      # Start Flask (localhost:5000)
```

---

**End of Documentation**

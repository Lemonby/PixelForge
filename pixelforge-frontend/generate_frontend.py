import os

def create_file(path, content):
    dir_name = os.path.dirname(path)
    if dir_name:
        os.makedirs(dir_name, exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# src/services/api.js
create_file('src/services/api.js', '''import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
''')

# src/store/imageStore.js
create_file('src/store/imageStore.js', '''import { create } from "zustand";

const useImageStore = create((set, get) => ({
  originalImage: null,
  currentImage: null,
  isProcessing: false,
  history: [],
  historyIndex: -1,
  
  setImage: (base64) => set({
    originalImage: base64,
    currentImage: base64,
    history: [base64],
    historyIndex: 0,
  }),
  
  updateImage: (base64) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    set({
      currentImage: base64,
      history: [...newHistory, base64],
      historyIndex: newHistory.length,
    });
  },
  
  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      set({
        historyIndex: historyIndex - 1,
        currentImage: history[historyIndex - 1],
      });
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      set({
        historyIndex: historyIndex + 1,
        currentImage: history[historyIndex + 1],
      });
    }
  },

  reset: () => {
    const { originalImage } = get();
    if (originalImage) {
      get().updateImage(originalImage);
    }
  },

  setProcessing: (status) => set({ isProcessing: status }),
}));

export default useImageStore;
''')

# src/components/Controls/SliderControl.jsx
create_file('src/components/Controls/SliderControl.jsx', '''import React, { useState, useEffect } from "react";
import * as Slider from "@radix-ui/react-slider";

const SliderControl = ({ label, min = -100, max = 100, step = 1, defaultValue = 0, onChange }) => {
  const [value, setValue] = useState([defaultValue]);

  const handleValueChange = (val) => {
    setValue(val);
  };

  const handlePointerUp = () => {
    if (onChange) onChange(value[0]);
  };

  return (
    <div className="mb-4 w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm text-cyber-text font-medium">{label}</label>
        <span className="text-xs text-cyber-cyan font-mono">{value[0]}</span>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={value}
        max={max}
        min={min}
        step={step}
        onValueChange={handleValueChange}
        onPointerUp={handlePointerUp}
      >
        <Slider.Track className="bg-cyber-bg relative grow rounded-full h-1">
          <Slider.Range className="absolute bg-cyber-cyan rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-4 h-4 bg-cyber-cyan shadow-[0_2px_10px] shadow-blackA4 rounded-full hover:bg-cyber-purple focus:outline-none focus:ring-2 focus:ring-cyber-purple/50 transition-colors"
          aria-label={label}
        />
      </Slider.Root>
    </div>
  );
};

export default SliderControl;
''')

# src/components/Toolbar/ToolbarActions.jsx
create_file('src/components/Toolbar/ToolbarActions.jsx', '''import React, { useRef } from "react";
import useImageStore from "../../store/imageStore";
import { Upload, Download, Undo, Redo, RotateCcw } from "lucide-react";

const ToolbarActions = () => {
  const { setImage, currentImage, undo, redo, reset, historyIndex, history } = useImageStore();
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result.split(",")[1];
        setImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (!currentImage) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${currentImage}`;
    link.download = "pixelforge-output.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center gap-2 glass px-4 py-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current.click()}
        className="p-2 hover:bg-cyber-surface rounded-lg transition-colors group relative"
        title="Upload Image"
      >
        <Upload size={18} className="text-cyber-cyan group-hover:text-cyber-purple" />
      </button>

      <div className="w-px h-6 bg-cyber-border mx-1" />

      <button
        onClick={undo}
        disabled={historyIndex <= 0}
        className="p-2 hover:bg-cyber-surface rounded-lg disabled:opacity-30 transition-colors text-cyber-text"
        title="Undo"
      >
        <Undo size={18} />
      </button>
      <button
        onClick={redo}
        disabled={historyIndex >= history.length - 1}
        className="p-2 hover:bg-cyber-surface rounded-lg disabled:opacity-30 transition-colors text-cyber-text"
        title="Redo"
      >
        <Redo size={18} />
      </button>

      <div className="w-px h-6 bg-cyber-border mx-1" />
      
      <button
        onClick={reset}
        disabled={!currentImage}
        className="p-2 hover:bg-cyber-surface rounded-lg disabled:opacity-30 transition-colors text-cyber-pink"
        title="Reset to Original"
      >
        <RotateCcw size={18} />
      </button>

      <div className="w-px h-6 bg-cyber-border mx-1" />

      <button
        onClick={handleDownload}
        disabled={!currentImage}
        className="p-2 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/30 rounded-lg disabled:opacity-30 transition-colors text-cyber-cyan"
        title="Download Result"
      >
        <Download size={18} />
      </button>
    </div>
  );
};

export default ToolbarActions;
''')

# src/components/Controls/FilterPanel.jsx
create_file('src/components/Controls/FilterPanel.jsx', '''import React from "react";
import useImageStore from "../../store/imageStore";
import api from "../../services/api";
import SliderControl from "./SliderControl";
import { Sun, Contrast, Image as ImageIcon, Sparkles, Droplets, Move, RotateCw, Crop, Scan } from "lucide-react";

const FilterPanel = () => {
  const { currentImage, updateImage, setProcessing, isProcessing } = useImageStore();

  const applyProcess = async (endpoint, payload) => {
    if (!currentImage) return;
    setProcessing(true);
    try {
      const res = await api.post(endpoint, { image: currentImage, ...payload });
      if (res.data.status === "ok") {
        updateImage(res.data.result_image);
      }
    } catch (err) {
      console.error(err);
      alert("Error processing image");
    } finally {
      setProcessing(false);
    }
  };

  const handleAction = (endpoint, payload = {}) => {
    applyProcess(endpoint, payload);
  };

  if (!currentImage) {
    return (
      <div className="glass p-6 w-80 h-full flex items-center justify-center text-cyber-muted text-center flex-col gap-4">
        <ImageIcon size={48} className="opacity-20" />
        <p>Upload an image to start editing</p>
      </div>
    );
  }

  return (
    <div className="glass p-6 w-80 h-full overflow-y-auto space-y-8 custom-scrollbar">
      {/* Enhancement Section */}
      <section>
        <h3 className="text-sm font-bold text-cyber-purple uppercase tracking-wider mb-4 flex items-center gap-2">
          <Sparkles size={16} /> Enhancements
        </h3>
        <SliderControl
          label="Brightness"
          min={-100} max={100} step={1} defaultValue={0}
          onChange={(val) => applyProcess("/api/enhancement/brightness", { value: val })}
        />
        <SliderControl
          label="Contrast"
          min={-100} max={100} step={1} defaultValue={0}
          onChange={(val) => applyProcess("/api/enhancement/contrast", { value: val })}
        />
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={() => handleAction("/api/enhancement/histogram-eq")}
            className="p-2 text-xs border border-cyber-border rounded hover:bg-cyber-surface transition-colors"
          >
            Auto Enhance
          </button>
          <button
            onClick={() => handleAction("/api/enhancement/sharpen", { level: 1 })}
            className="p-2 text-xs border border-cyber-border rounded hover:bg-cyber-surface transition-colors"
          >
            Sharpen
          </button>
          <button
            onClick={() => handleAction("/api/enhancement/smooth", { level: 2 })}
            className="p-2 text-xs border border-cyber-border rounded hover:bg-cyber-surface transition-colors"
          >
            Smooth/Blur
          </button>
        </div>
      </section>

      {/* Geometry Section */}
      <section>
        <h3 className="text-sm font-bold text-cyber-cyan uppercase tracking-wider mb-4 flex items-center gap-2">
          <Move size={16} /> Transform
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleAction("/api/transform/rotate", { angle: -90 })}
            className="p-2 text-xs border border-cyber-border rounded hover:bg-cyber-surface transition-colors flex items-center justify-center gap-1"
          >
            <RotateCw size={12} className="-scale-x-100" /> -90°
          </button>
          <button
            onClick={() => handleAction("/api/transform/rotate", { angle: 90 })}
            className="p-2 text-xs border border-cyber-border rounded hover:bg-cyber-surface transition-colors flex items-center justify-center gap-1"
          >
            <RotateCw size={12} /> +90°
          </button>
          <button
            onClick={() => handleAction("/api/transform/flip", { direction: 'h' })}
            className="p-2 text-xs border border-cyber-border rounded hover:bg-cyber-surface transition-colors"
          >
            Flip H
          </button>
          <button
            onClick={() => handleAction("/api/transform/flip", { direction: 'v' })}
            className="p-2 text-xs border border-cyber-border rounded hover:bg-cyber-surface transition-colors"
          >
            Flip V
          </button>
        </div>
      </section>
      
      {/* Loading Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-cyber-bg/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
          <div className="w-8 h-8 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
''')

# src/components/ImagePanel/ImageCanvas.jsx
create_file('src/components/ImagePanel/ImageCanvas.jsx', '''import React from "react";
import useImageStore from "../../store/imageStore";

const ImageCanvas = () => {
  const { currentImage } = useImageStore();

  if (!currentImage) {
    return (
      <div className="w-full h-full glass flex items-center justify-center border-dashed border-2 border-cyber-border p-10 bg-cyber-bg/50">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-cyber-surface rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2400/svg">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 8L12 3L7 8" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 3V15" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-cyber-text mb-2 tracking-wide">Forge Your Vision</h2>
          <p className="text-cyber-muted text-sm leading-relaxed">
            Upload an image to start applying advanced digital image processing algorithms with real-time feedback.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full glass relative overflow-hidden flex items-center justify-center p-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzExMTgyNyIvPgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMwRDExMTciLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMwRDExMTciLz4KPC9zdmc+')]">
      <img
        src={`data:image/png;base64,${currentImage}`}
        alt="Canvas"
        className="max-w-full max-h-full object-contain rounded drop-shadow-2xl transition-all duration-300"
      />
    </div>
  );
};

export default ImageCanvas;
''')

# src/pages/EditorPage.jsx
create_file('src/pages/EditorPage.jsx', '''import React from "react";
import ToolbarActions from "../components/Toolbar/ToolbarActions";
import FilterPanel from "../components/Controls/FilterPanel";
import ImageCanvas from "../components/ImagePanel/ImageCanvas";

const EditorPage = () => {
  return (
    <div className="h-screen w-full flex flex-col p-4 gap-4 overflow-hidden">
      {/* Header / Topbar */}
      <header className="flex justify-between items-center glass px-6 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(124,58,237,0.5)]">
            PF
          </div>
          <h1 className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyber-cyan to-cyber-purple">
            PIXELFORGE
          </h1>
        </div>
        
        <ToolbarActions />
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex gap-4 min-h-0">
        <aside className="w-80 shrink-0 relative">
          <FilterPanel />
        </aside>
        
        <section className="flex-1 min-w-0 relative">
          <ImageCanvas />
        </section>
      </main>
    </div>
  );
};

export default EditorPage;
''')

# src/App.jsx
create_file('src/App.jsx', '''import React from "react";
import EditorPage from "./pages/EditorPage";

function App() {
  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text font-mono">
      <EditorPage />
    </div>
  );
}

export default App;
''')

# src/main.jsx (Ensure clean imports)
create_file('src/main.jsx', '''import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
''')

print("Frontend files generated")

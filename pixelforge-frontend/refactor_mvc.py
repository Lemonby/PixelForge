import os

def create_file(path, content):
    dir_name = os.path.dirname(path)
    if dir_name:
        os.makedirs(dir_name, exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# 1. MODEL (src/models/imageModel.js)
create_file('src/models/imageModel.js', '''import { create } from "zustand";

export const useImageModel = create((set, get) => ({
  originalImage: null,
  currentImage: null,
  isProcessing: false,
  history: [],
  historyIndex: -1,
  
  setInitialImage: (base64) => set({
    originalImage: base64,
    currentImage: base64,
    history: [base64],
    historyIndex: 0,
  }),
  
  setResultImage: (base64) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    set({
      currentImage: base64,
      history: [...newHistory, base64],
      historyIndex: newHistory.length,
    });
  },
  
  stepBack: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      set({
        historyIndex: historyIndex - 1,
        currentImage: history[historyIndex - 1],
      });
    }
  },

  stepForward: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      set({
        historyIndex: historyIndex + 1,
        currentImage: history[historyIndex + 1],
      });
    }
  },

  resetToOriginal: () => {
    const { originalImage } = get();
    if (originalImage) {
      get().setResultImage(originalImage);
    }
  },

  setProcessingState: (status) => set({ isProcessing: status }),
}));
''')

# 2. CONTROLLER (src/controllers/editorController.js)
create_file('src/controllers/editorController.js', '''import { useImageModel } from "../models/imageModel";
import api from "../services/api";

export const useEditorController = () => {
  const model = useImageModel();

  const handleFileUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result.split(",")[1];
        model.setInitialImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (!model.currentImage) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${model.currentImage}`;
    link.download = "pixelforge-premium.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const applyProcess = async (endpoint, payload = {}) => {
    if (!model.currentImage) return;
    model.setProcessingState(true);
    try {
      const res = await api.post(endpoint, { image: model.currentImage, ...payload });
      if (res.data.status === "ok") {
        model.setResultImage(res.data.result_image);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during processing.");
    } finally {
      model.setProcessingState(false);
    }
  };

  return {
    ...model,
    handleFileUpload,
    handleDownload,
    applyProcess
  };
};
''')

# 3. VIEWS (Components)
# src/views/components/SliderControl.jsx
create_file('src/views/components/SliderControl.jsx', '''import React, { useState } from "react";
import * as Slider from "@radix-ui/react-slider";

const SliderControl = ({ label, min = -100, max = 100, step = 1, defaultValue = 0, onChange }) => {
  const [value, setValue] = useState([defaultValue]);

  return (
    <div className="mb-5 w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold text-white/90 tracking-wide">{label}</label>
        <span className="text-xs bg-white/10 px-2 py-1 rounded font-mono text-cyber-cyan shadow-inner">
          {value[0]}
        </span>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={value}
        max={max}
        min={min}
        step={step}
        onValueChange={(val) => setValue(val)}
        onPointerUp={() => onChange(value[0])}
      >
        <Slider.Track className="bg-white/10 relative grow rounded-full h-1.5 overflow-hidden">
          <Slider.Range className="absolute bg-gradient-to-r from-cyber-cyan to-cyber-purple h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-white border border-white/40 shadow-lg rounded-full focus:outline-none focus:ring-4 focus:ring-cyber-cyan/30 transition-transform hover:scale-110 cursor-grab active:cursor-grabbing"
          aria-label={label}
        />
      </Slider.Root>
    </div>
  );
};

export default SliderControl;
''')

# src/views/components/FilterPanel.jsx
create_file('src/views/components/FilterPanel.jsx', '''import React from "react";
import SliderControl from "./SliderControl";
import { Sparkles, Move, RotateCw, Image as ImageIcon } from "lucide-react";
import { useEditorController } from "../../controllers/editorController";

const FilterPanel = () => {
  const { currentImage, isProcessing, applyProcess } = useEditorController();

  if (!currentImage) {
    return (
      <div className="glass-panel w-80 h-full flex items-center justify-center text-cyber-muted text-center flex-col gap-4 p-8">
        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <ImageIcon size={48} className="opacity-30" />
        </div>
        <p className="text-sm font-medium">Please upload an image to access the advanced toolset.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel w-80 h-full overflow-y-auto custom-scrollbar relative">
      <div className="p-6 space-y-10">
        
        {/* Enhancement Section */}
        <section>
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-2">
            <Sparkles size={18} className="text-cyber-purple" />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Enhancements</h3>
          </div>
          
          <SliderControl
            label="Brightness" min={-100} max={100} step={1} defaultValue={0}
            onChange={(val) => applyProcess("/api/enhancement/brightness", { value: val })}
          />
          <SliderControl
            label="Contrast" min={-100} max={100} step={1} defaultValue={0}
            onChange={(val) => applyProcess("/api/enhancement/contrast", { value: val })}
          />
          
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={() => applyProcess("/api/enhancement/histogram-eq")}
              className="glass-button py-2 text-xs font-medium text-white tracking-wide"
            >
              Auto Enhance
            </button>
            <button
              onClick={() => applyProcess("/api/enhancement/sharpen", { level: 2 })}
              className="glass-button py-2 text-xs font-medium text-white tracking-wide"
            >
              Sharpen
            </button>
            <button
              onClick={() => applyProcess("/api/enhancement/smooth", { level: 2 })}
              className="glass-button py-2 text-xs font-medium text-white tracking-wide col-span-2"
            >
              Smooth / Blur
            </button>
          </div>
        </section>

        {/* Transform Section */}
        <section>
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-2">
            <Move size={18} className="text-cyber-cyan" />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Transform</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => applyProcess("/api/transform/rotate", { angle: -90 })}
              className="glass-button py-2 flex items-center justify-center gap-2 text-xs font-medium text-white"
            >
              <RotateCw size={14} className="-scale-x-100 text-cyber-cyan" /> -90°
            </button>
            <button
              onClick={() => applyProcess("/api/transform/rotate", { angle: 90 })}
              className="glass-button py-2 flex items-center justify-center gap-2 text-xs font-medium text-white"
            >
              <RotateCw size={14} className="text-cyber-cyan" /> +90°
            </button>
            <button
              onClick={() => applyProcess("/api/transform/flip", { direction: 'h' })}
              className="glass-button py-2 text-xs font-medium text-white"
            >
              Flip Horiz
            </button>
            <button
              onClick={() => applyProcess("/api/transform/flip", { direction: 'v' })}
              className="glass-button py-2 text-xs font-medium text-white"
            >
              Flip Vert
            </button>
          </div>
        </section>

      </div>

      {isProcessing && (
        <div className="absolute inset-0 bg-cyber-bg/40 backdrop-blur-md z-20 flex items-center justify-center rounded-2xl">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-white/20 border-t-cyber-cyan rounded-full animate-spin"></div>
            <span className="text-xs font-medium text-cyber-cyan uppercase tracking-widest animate-pulse">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
''')

# src/views/components/TopBar.jsx
create_file('src/views/components/TopBar.jsx', '''import React, { useRef } from "react";
import { Upload, Download, Undo, Redo, RotateCcw } from "lucide-react";
import { useEditorController } from "../../controllers/editorController";

const TopBar = () => {
  const { currentImage, handleFileUpload, handleDownload, stepBack, stepForward, resetToOriginal, historyIndex, history } = useEditorController();
  const fileRef = useRef(null);

  return (
    <header className="flex justify-between items-center glass-panel px-8 py-4 shrink-0 z-10">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(0,240,255,0.4)]">
          PF
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-widest text-white leading-tight">PIXELFORGE</h1>
          <span className="text-[10px] text-cyber-cyan uppercase tracking-[0.2em]">Studio Edition</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-xl border border-white/5">
        <input type="file" ref={fileRef} onChange={(e) => handleFileUpload(e.target.files[0])} accept="image/*" className="hidden" />
        
        <button onClick={() => fileRef.current.click()} className="p-2.5 rounded-lg hover:bg-white/10 transition-colors group" title="Upload Image">
          <Upload size={18} className="text-white group-hover:text-cyber-cyan" />
        </button>

        <div className="w-px h-6 bg-white/10 mx-1" />

        <button onClick={stepBack} disabled={historyIndex <= 0} className="p-2.5 rounded-lg hover:bg-white/10 disabled:opacity-20 transition-colors text-white">
          <Undo size={18} />
        </button>
        <button onClick={stepForward} disabled={historyIndex >= history.length - 1} className="p-2.5 rounded-lg hover:bg-white/10 disabled:opacity-20 transition-colors text-white">
          <Redo size={18} />
        </button>

        <div className="w-px h-6 bg-white/10 mx-1" />
        
        <button onClick={resetToOriginal} disabled={!currentImage} className="p-2.5 rounded-lg hover:bg-white/10 disabled:opacity-20 transition-colors text-cyber-pink">
          <RotateCcw size={18} />
        </button>

        <div className="w-px h-6 bg-white/10 mx-1" />

        <button onClick={handleDownload} disabled={!currentImage} className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg disabled:opacity-20 transition-all text-white font-medium text-sm flex items-center gap-2">
          <Download size={16} /> Export
        </button>
      </div>
    </header>
  );
};

export default TopBar;
''')

# src/views/components/ImageCanvas.jsx
create_file('src/views/components/ImageCanvas.jsx', '''import React from "react";
import { useEditorController } from "../../controllers/editorController";

const ImageCanvas = () => {
  const { currentImage } = useEditorController();

  if (!currentImage) {
    return (
      <div className="w-full h-full glass-panel flex flex-col items-center justify-center p-10 relative overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="text-center max-w-md z-10">
          <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 shadow-2xl backdrop-blur-md">
            <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-cyber-cyan animate-spin-slow"></div>
            <div className="absolute w-8 h-8 rounded-full border-b-2 border-l-2 border-cyber-purple animate-spin-reverse-slow"></div>
          </div>
          <h2 className="text-3xl font-light text-white mb-3 tracking-wide">Forge Your Vision</h2>
          <p className="text-cyber-muted text-sm leading-relaxed font-light">
            Experience premium digital image processing. Upload an image to initialize the workspace.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full glass-panel relative overflow-hidden flex items-center justify-center p-6 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
      {/* Background Checkerboard for transparency indication */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'conic-gradient(white 90deg, transparent 90deg 180deg, white 180deg 270deg, transparent 270deg 360deg)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}></div>
      
      <img
        src={`data:image/png;base64,${currentImage}`}
        alt="Canvas"
        className="max-w-full max-h-full object-contain rounded-lg drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 z-10"
      />
    </div>
  );
};

export default ImageCanvas;
''')

# src/views/pages/EditorPage.jsx
create_file('src/views/pages/EditorPage.jsx', '''import React from "react";
import TopBar from "../components/TopBar";
import FilterPanel from "../components/FilterPanel";
import ImageCanvas from "../components/ImageCanvas";

const EditorPage = () => {
  return (
    <>
      {/* Ambient Orbs */}
      <div className="orb-1"></div>
      <div className="orb-2"></div>
      
      <div className="h-screen w-full flex flex-col p-6 gap-6 overflow-hidden relative z-10">
        <TopBar />

        <main className="flex-1 flex gap-6 min-h-0">
          <aside className="w-[340px] shrink-0">
            <FilterPanel />
          </aside>
          
          <section className="flex-1 min-w-0">
            <ImageCanvas />
          </section>
        </main>
      </div>
    </>
  );
};

export default EditorPage;
''')

# src/App.jsx update
create_file('src/App.jsx', '''import React from "react";
import EditorPage from "./views/pages/EditorPage";

function App() {
  return (
    <EditorPage />
  );
}

export default App;
''')

print("Refactored to MVC")

import React from "react";
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

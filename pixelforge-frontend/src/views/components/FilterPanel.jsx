import React, { useState } from "react";
import SliderControl from "./SliderControl";
import { 
  Sparkles, 
  Move, 
  RotateCw, 
  Image as ImageIcon,
  Sliders,
  ChevronDown,
  ChevronRight,
  Maximize2
} from "lucide-react";
import { useEditorController } from "../../controllers/editorController";

const FilterPanel = () => {
  const { currentImage, isProcessing, applyProcess, applyAdjustment, currentAdjustments } = useEditorController();
  const [isEnhanceOpen, setIsEnhanceOpen] = useState(true);
  const [isTransformOpen, setIsTransformOpen] = useState(true);

  if (!currentImage) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[#8e8e8e] text-center p-6 bg-[#2b2b2b]">
        <ImageIcon size={32} className="opacity-25 mb-3" />
        <span className="text-[11px] font-medium leading-relaxed max-w-[200px]">
          Please load a document to activate Adjustments
        </span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#2b2b2b] select-none h-full overflow-hidden relative">
      {/* Panel Top Title */}
      <div className="ps-panel-header shrink-0">
        <div className="flex items-center gap-1.5">
          <Sliders size={12} className="text-[#007acc]" />
          <span>Adjustments</span>
        </div>
      </div>

      {/* Accordion Panels */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
        
        {/* Module 1: Enhancements (Brightness, Contrast, auto enhance, sharpen, blur) */}
        <div className="border border-[#1a1a1a] rounded bg-[#202020]">
          <button 
            onClick={() => setIsEnhanceOpen(!isEnhanceOpen)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 bg-[#2c2c2c] hover:bg-[#323232] border-b border-[#1a1a1a] text-[10px] font-bold uppercase tracking-wider text-[#cccccc]"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles size={11} className="text-[#007acc]" />
              <span>Color Adjustments</span>
            </div>
            {isEnhanceOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
          </button>

          {isEnhanceOpen && (
            <div className="p-3 space-y-4">
              <SliderControl
                label="Brightness"
                min={-100}
                max={100}
                step={1}
                defaultValue={currentAdjustments.brightness}
                onChange={(val) => applyAdjustment("brightness", val)}
              />
              <SliderControl
                label="Contrast"
                min={-100}
                max={100}
                step={1}
                defaultValue={currentAdjustments.contrast}
                onChange={(val) => applyAdjustment("contrast", val)}
              />
              
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#2c2c2c]">
                <button
                  onClick={() => applyProcess("/api/enhancement/histogram-eq")}
                  className="ps-button py-1 text-[10px] w-full text-center"
                  title="Auto Levels Histogram Equalization"
                >
                  Auto Tone
                </button>
                <button
                  onClick={() => applyProcess("/api/enhancement/sharpen", { level: 2 })}
                  className="ps-button py-1 text-[10px] w-full text-center"
                  title="Apply Sharpen Convolution Kernel"
                >
                  Sharpen
                </button>
                <button
                  onClick={() => applyProcess("/api/enhancement/smooth", { level: 2 })}
                  className="ps-button py-1 text-[10px] col-span-2 text-center"
                  title="Apply Gaussian Smooth Convolution"
                >
                  Blur / Smooth
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Module 2: Geometric Transforms */}
        <div className="border border-[#1a1a1a] rounded bg-[#202020]">
          <button 
            onClick={() => setIsTransformOpen(!isTransformOpen)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 bg-[#2c2c2c] hover:bg-[#323232] border-b border-[#1a1a1a] text-[10px] font-bold uppercase tracking-wider text-[#cccccc]"
          >
            <div className="flex items-center gap-1.5">
              <Move size={11} className="text-[#007acc]" />
              <span>Canvas Transform</span>
            </div>
            {isTransformOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
          </button>

          {isTransformOpen && (
            <div className="p-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => applyProcess("/api/transform/rotate", { angle: -90 })}
                  className="ps-button py-1.5 flex items-center justify-center gap-1 text-[10px]"
                  title="Rotate Counter-Clockwise"
                >
                  <RotateCw size={11} className="-scale-x-100 text-[#8e8e8e]" /> -90°
                </button>
                <button
                  onClick={() => applyProcess("/api/transform/rotate", { angle: 90 })}
                  className="ps-button py-1.5 flex items-center justify-center gap-1 text-[10px]"
                  title="Rotate Clockwise"
                >
                  <RotateCw size={11} className="text-[#8e8e8e]" /> +90°
                </button>
                <button
                  onClick={() => applyProcess("/api/transform/flip", { direction: 'h' })}
                  className="ps-button py-1.5 text-[10px]"
                  title="Flip Image Horizontal"
                >
                  Flip Horizontal
                </button>
                <button
                  onClick={() => applyProcess("/api/transform/flip", { direction: 'v' })}
                  className="ps-button py-1.5 text-[10px]"
                  title="Flip Image Vertical"
                >
                  Flip Vertical
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Photoshop styled processing overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-30 flex items-center justify-center">
          <div className="bg-[#212121] border border-[#1a1a1a] rounded px-4 py-3 shadow-2xl flex flex-col items-center gap-2 max-w-[200px]">
            <div className="w-5 h-5 border-2 border-[#3e3e3e] border-t-[#007acc] rounded-full animate-spin"></div>
            <span className="text-[10px] font-semibold text-white tracking-wide uppercase">
              Processing...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;


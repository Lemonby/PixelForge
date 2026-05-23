import React, { useState, useEffect } from "react";
import SliderControl from "./SliderControl";
import { 
  Sparkles, 
  Move, 
  RotateCw, 
  Image as ImageIcon,
  Sliders,
  ChevronDown,
  ChevronRight,
  Shield,
  Crop as CropIcon,
  Maximize,
  ArrowRight
} from "lucide-react";
import { useEditorController } from "../../controllers/editorController";

const FilterPanel = () => {
  const { currentImage, isProcessing, applyProcess, applyAdjustment, currentAdjustments } = useEditorController();
  const [isEnhanceOpen, setIsEnhanceOpen] = useState(true);
  const [isTransformOpen, setIsTransformOpen] = useState(true);
  const [isRestorationOpen, setIsRestorationOpen] = useState(true);

  // Geometric state variables
  const [interpolation, setInterpolation] = useState("bilinear");
  const [rotateAngle, setRotateAngle] = useState(45);
  const [tx, setTx] = useState(50);
  const [ty, setTy] = useState(50);
  const [resizeWidth, setResizeWidth] = useState(800);
  const [resizeHeight, setResizeHeight] = useState(600);
  
  // Crop state variables
  const [cropX, setCropX] = useState(50);
  const [cropY, setCropY] = useState(50);
  const [cropW, setCropW] = useState(400);
  const [cropH, setCropH] = useState(400);

  // Restoration state variables
  const [gaussianKernel, setGaussianKernel] = useState(5);
  const [medianKernel, setMedianKernel] = useState(5);
  const [noiseRemovalKernel, setNoiseRemovalKernel] = useState(5);

  // Keep track of active image properties to pre-populate dimensions
  useEffect(() => {
    if (!currentImage) return;
    const img = new Image();
    img.onload = () => {
      setResizeWidth(img.width);
      setResizeHeight(img.height);
      setCropW(Math.min(400, Math.floor(img.width * 0.8)));
      setCropH(Math.min(400, Math.floor(img.height * 0.8)));
    };
    img.src = `data:image/png;base64,${currentImage}`;
  }, [currentImage]);

  if (!currentImage) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[#8e8e8e] text-center p-6 bg-[#2b2b2b]">
        <ImageIcon size={32} className="opacity-25 mb-3" />
        <span className="text-[11px] font-medium leading-relaxed max-w-[200px]">
          Please load a document to activate Adjustments & Transform Tools
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
          <span>Adjustments & Filters</span>
        </div>
      </div>

      {/* Accordion Panels */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4 ps-scrollbar">
        
        {/* Section 1: Enhancements (Brightness, Contrast, etc.) */}
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

        {/* Section 2: Geometric Transforms */}
        <div className="border border-[#1a1a1a] rounded bg-[#202020]">
          <button 
            onClick={() => setIsTransformOpen(!isTransformOpen)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 bg-[#2c2c2c] hover:bg-[#323232] border-b border-[#1a1a1a] text-[10px] font-bold uppercase tracking-wider text-[#cccccc]"
          >
            <div className="flex items-center gap-1.5">
              <Move size={11} className="text-[#007acc]" />
              <span>Geometric Transform</span>
            </div>
            {isTransformOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
          </button>

          {isTransformOpen && (
            <div className="p-3 space-y-3">
              
              {/* Interpolation Selector */}
              <div className="flex items-center justify-between border-b border-[#2c2c2c] pb-2 text-[10px]">
                <span className="text-[#8e8e8e]">Interpolation:</span>
                <select
                  value={interpolation}
                  onChange={(e) => setInterpolation(e.target.value)}
                  className="ps-input py-0.5 bg-[#1b1b1b] text-white text-[10px] border border-[#1a1a1a] rounded focus:border-[#007acc] outline-none"
                >
                  <option value="bilinear">Bilinear</option>
                  <option value="nearest">Nearest Neighbor</option>
                </select>
              </div>

              {/* 1. Rotate Slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-[#8e8e8e]">Rotate:</span>
                  <span className="text-white font-mono">{rotateAngle}°</span>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={rotateAngle}
                    onChange={(e) => setRotateAngle(parseInt(e.target.value))}
                    className="flex-1 accent-[#007acc] h-1 bg-[#1a1a1a] rounded-lg cursor-pointer"
                  />
                  <button
                    onClick={() => applyProcess("/api/transform/rotate", { angle: rotateAngle, interpolation })}
                    className="ps-button py-0.5 px-2 text-[9px] h-6 flex items-center justify-center gap-0.5"
                    title="Apply Custom Rotation"
                  >
                    <RotateCw size={9} /> Rotate
                  </button>
                </div>
                {/* Standard presets */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => applyProcess("/api/transform/rotate", { angle: -90, interpolation })}
                    className="ps-button py-0.5 text-[9px]"
                  >
                    -90° Quick
                  </button>
                  <button
                    onClick={() => applyProcess("/api/transform/rotate", { angle: 90, interpolation })}
                    className="ps-button py-0.5 text-[9px]"
                  >
                    +90° Quick
                  </button>
                </div>
              </div>

              {/* 2. Flip */}
              <div className="pt-2 border-t border-[#2c2c2c]/60 space-y-1">
                <span className="text-[#8e8e8e] text-[9.5px] block">Flip Canvas:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => applyProcess("/api/transform/flip", { direction: 'h' })}
                    className="ps-button py-1 text-[9.5px]"
                    title="Flip Image Horizontal"
                  >
                    Flip Horizontal
                  </button>
                  <button
                    onClick={() => applyProcess("/api/transform/flip", { direction: 'v' })}
                    className="ps-button py-1 text-[9.5px]"
                    title="Flip Image Vertical"
                  >
                    Flip Vertical
                  </button>
                </div>
              </div>

              {/* 3. Translation */}
              <div className="pt-2 border-t border-[#2c2c2c]/60 space-y-1.5">
                <span className="text-[#8e8e8e] text-[9.5px] block">Translate (Geser Posisi):</span>
                <div className="flex gap-2 items-center">
                  <div className="flex flex-1 gap-1.5">
                    <div className="flex items-center gap-1 bg-[#1e1e1e] border border-[#1a1a1a] rounded px-1 flex-1">
                      <span className="text-[9px] text-[#6e6e6e] font-bold">X:</span>
                      <input
                        type="number"
                        value={tx}
                        onChange={(e) => setTx(parseInt(e.target.value) || 0)}
                        className="w-full bg-transparent text-white font-mono text-[10px] focus:outline-none border-none py-0.5 px-0.5"
                      />
                    </div>
                    <div className="flex items-center gap-1 bg-[#1e1e1e] border border-[#1a1a1a] rounded px-1 flex-1">
                      <span className="text-[9px] text-[#6e6e6e] font-bold">Y:</span>
                      <input
                        type="number"
                        value={ty}
                        onChange={(e) => setTy(parseInt(e.target.value) || 0)}
                        className="w-full bg-transparent text-white font-mono text-[10px] focus:outline-none border-none py-0.5 px-0.5"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => applyProcess("/api/transform/translate", { tx, ty, interpolation })}
                    className="ps-button py-1 px-2.5 text-[9.5px]"
                    title="Translate Canvas"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* 4. Resize */}
              <div className="pt-2 border-t border-[#2c2c2c]/60 space-y-1.5">
                <span className="text-[#8e8e8e] text-[9.5px] block">Resize (Scaling):</span>
                <div className="flex gap-2 items-center">
                  <div className="flex flex-1 gap-1.5">
                    <div className="flex items-center gap-1 bg-[#1e1e1e] border border-[#1a1a1a] rounded px-1 flex-1">
                      <span className="text-[9px] text-[#6e6e6e] font-mono">W:</span>
                      <input
                        type="number"
                        value={resizeWidth}
                        onChange={(e) => setResizeWidth(parseInt(e.target.value) || 0)}
                        className="w-full bg-transparent text-white font-mono text-[10px] focus:outline-none border-none py-0.5 px-0.5"
                      />
                    </div>
                    <div className="flex items-center gap-1 bg-[#1e1e1e] border border-[#1a1a1a] rounded px-1 flex-1">
                      <span className="text-[9px] text-[#6e6e6e] font-mono">H:</span>
                      <input
                        type="number"
                        value={resizeHeight}
                        onChange={(e) => setResizeHeight(parseInt(e.target.value) || 0)}
                        className="w-full bg-transparent text-white font-mono text-[10px] focus:outline-none border-none py-0.5 px-0.5"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => applyProcess("/api/transform/resize", { width: resizeWidth, height: resizeHeight, interpolation })}
                    className="ps-button py-1 px-2.5 text-[9.5px]"
                    title="Scale Image"
                  >
                    Scale
                  </button>
                </div>
              </div>

              {/* 5. Crop */}
              <div className="pt-2 border-t border-[#2c2c2c]/60 space-y-1.5">
                <div className="flex items-center gap-1 text-[#8e8e8e] text-[9.5px]">
                  <CropIcon size={10} />
                  <span>Crop Canvas (Drag Area Box):</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="flex items-center gap-1 bg-[#1e1e1e] border border-[#1a1a1a] rounded px-1">
                    <span className="text-[9px] text-[#6e6e6e]">X:</span>
                    <input
                      type="number"
                      value={cropX}
                      onChange={(e) => setCropX(parseInt(e.target.value) || 0)}
                      className="w-full bg-transparent text-white font-mono text-[9.5px] focus:outline-none border-none py-0.5"
                    />
                  </div>
                  <div className="flex items-center gap-1 bg-[#1e1e1e] border border-[#1a1a1a] rounded px-1">
                    <span className="text-[9px] text-[#6e6e6e]">Y:</span>
                    <input
                      type="number"
                      value={cropY}
                      onChange={(e) => setCropY(parseInt(e.target.value) || 0)}
                      className="w-full bg-transparent text-white font-mono text-[9.5px] focus:outline-none border-none py-0.5"
                    />
                  </div>
                  <div className="flex items-center gap-1 bg-[#1e1e1e] border border-[#1a1a1a] rounded px-1">
                    <span className="text-[9px] text-[#6e6e6e]">W:</span>
                    <input
                      type="number"
                      value={cropW}
                      onChange={(e) => setCropW(parseInt(e.target.value) || 1)}
                      className="w-full bg-transparent text-white font-mono text-[9.5px] focus:outline-none border-none py-0.5"
                    />
                  </div>
                  <div className="flex items-center gap-1 bg-[#1e1e1e] border border-[#1a1a1a] rounded px-1">
                    <span className="text-[9px] text-[#6e6e6e]">H:</span>
                    <input
                      type="number"
                      value={cropH}
                      onChange={(e) => setCropH(parseInt(e.target.value) || 1)}
                      className="w-full bg-transparent text-white font-mono text-[9.5px] focus:outline-none border-none py-0.5"
                    />
                  </div>
                </div>
                <button
                  onClick={() => applyProcess("/api/transform/crop", { x: cropX, y: cropY, w: cropW, h: cropH })}
                  className="ps-button-primary w-full py-1 text-[9.5px] font-semibold text-center mt-1 flex items-center justify-center gap-1"
                >
                  <CropIcon size={10} /> Crop Canvas Bounding Box
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Section 3: Image Restoration (Noise Reduction) */}
        <div className="border border-[#1a1a1a] rounded bg-[#202020]">
          <button 
            onClick={() => setIsRestorationOpen(!isRestorationOpen)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 bg-[#2c2c2c] hover:bg-[#323232] border-b border-[#1a1a1a] text-[10px] font-bold uppercase tracking-wider text-[#cccccc]"
          >
            <div className="flex items-center gap-1.5">
              <Shield size={11} className="text-[#007acc]" />
              <span>Image Restoration</span>
            </div>
            {isRestorationOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
          </button>

          {isRestorationOpen && (
            <div className="p-3 space-y-4">
              
              {/* 1. Gaussian Blur (Spatial Filtering) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-[#cccccc] font-semibold">Gaussian Blur</span>
                  <span className="text-[#8e8e8e] text-[9px] font-mono">Kernel Convolution</span>
                </div>
                <p className="text-[9px] text-[#8e8e8e] leading-relaxed">
                  Smooths out details and noise using Gaussian spatial filter convolution.
                </p>
                <div className="flex gap-2">
                  <select
                    value={gaussianKernel}
                    onChange={(e) => setGaussianKernel(parseInt(e.target.value))}
                    className="ps-input py-0.5 bg-[#1b1b1b] text-white text-[10px] border border-[#1a1a1a] rounded focus:border-[#007acc] outline-none flex-1 font-mono"
                  >
                    <option value="3">3 x 3 px</option>
                    <option value="5">5 x 5 px</option>
                    <option value="7">7 x 7 px</option>
                  </select>
                  <button
                    onClick={() => applyProcess("/api/filter/gaussian", { kernel_size: gaussianKernel })}
                    className="ps-button py-1 px-3 text-[9.5px]"
                  >
                    Apply Blur
                  </button>
                </div>
              </div>

              {/* 2. Median Filter (Spatial Filtering) */}
              <div className="pt-3 border-t border-[#2c2c2c]/60 space-y-1.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-[#cccccc] font-semibold">Median Filter</span>
                  <span className="text-[#8e8e8e] text-[9px] font-mono">Non-linear spatial</span>
                </div>
                <p className="text-[9px] text-[#8e8e8e] leading-relaxed">
                  Replaces each pixel with the median of neighboring pixels. Preserves sharp edges.
                </p>
                <div className="flex gap-2">
                  <select
                    value={medianKernel}
                    onChange={(e) => setMedianKernel(parseInt(e.target.value))}
                    className="ps-input py-0.5 bg-[#1b1b1b] text-white text-[10px] border border-[#1a1a1a] rounded focus:border-[#007acc] outline-none flex-1 font-mono"
                  >
                    <option value="3">3 x 3 px</option>
                    <option value="5">5 x 5 px</option>
                    <option value="7">7 x 7 px</option>
                  </select>
                  <button
                    onClick={() => applyProcess("/api/filter/median", { kernel_size: medianKernel })}
                    className="ps-button py-1 px-3 text-[9.5px]"
                  >
                    Apply Median
                  </button>
                </div>
              </div>

              {/* 3. Salt & Pepper Noise Removal */}
              <div className="pt-3 border-t border-[#2c2c2c]/60 space-y-1.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-[#cccccc] font-semibold">Salt & Pepper Removal</span>
                  <span className="text-[#8e8e8e] text-[9px] font-mono">Impulse Reduction</span>
                </div>
                <p className="text-[9px] text-[#8e8e8e] leading-relaxed">
                  Specialized non-linear filter specifically designed to clear impulse noise artifacts.
                </p>
                <div className="flex gap-2">
                  <select
                    value={noiseRemovalKernel}
                    onChange={(e) => setNoiseRemovalKernel(parseInt(e.target.value))}
                    className="ps-input py-0.5 bg-[#1b1b1b] text-white text-[10px] border border-[#1a1a1a] rounded focus:border-[#007acc] outline-none flex-1 font-mono"
                  >
                    <option value="3">3 x 3 px</option>
                    <option value="5">5 x 5 px</option>
                    <option value="7">7 x 7 px</option>
                  </select>
                  <button
                    onClick={() => applyProcess("/api/filter/noise-removal", { kernel_size: noiseRemovalKernel })}
                    className="ps-button-primary py-1 px-3 text-[9.5px]"
                  >
                    Clear Noise
                  </button>
                </div>
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

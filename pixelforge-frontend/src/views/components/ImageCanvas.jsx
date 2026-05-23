import React, { useRef } from "react";
import { useEditorController } from "../../controllers/editorController";
import {
  FileImage,
  Upload,
  Plus,
  Grid,
  File,
  X,
  Maximize2,
  FolderOpen
} from "lucide-react";

const ImageCanvas = () => {
  const { currentImage, baseOriginalImage, handleFileUpload } = useEditorController();
  const fileRef = useRef(null);

  const handleAreaClick = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // Photoshop standard pixel rulers markings mockup helper
  const renderRulerLabelsX = () => (
    <div className="absolute inset-x-0 bottom-0.5 text-[8px] font-mono text-[#6e6e6e] pointer-events-none">
      <span className="absolute left-[20px]">0</span>
      <span className="absolute left-[80px]">200</span>
      <span className="absolute left-[140px]">400</span>
      <span className="absolute left-[200px]">600</span>
      <span className="absolute left-[260px]">800</span>
      <span className="absolute left-[320px]">1000</span>
      <span className="absolute left-[380px]">1200</span>
      <span className="absolute left-[440px]">1400</span>
    </div>
  );

  const renderRulerLabelsY = () => (
    <div className="absolute inset-y-0 right-0.5 text-[8px] font-mono text-[#6e6e6e] pointer-events-none leading-none">
      <span className="absolute top-[20px]">0</span>
      <span className="absolute top-[80px]">200</span>
      <span className="absolute top-[140px]">400</span>
      <span className="absolute top-[200px]">600</span>
      <span className="absolute top-[260px]">800</span>
      <span className="absolute top-[320px]">1000</span>
      <span className="absolute top-[380px]">1200</span>
    </div>
  );

  if (!currentImage) {
    // Photoshop "New Document" Welcome Interface
    return (
      <div className="w-full h-full bg-[#1e1e1e] flex flex-col p-8 select-none">
        <input
          type="file"
          ref={fileRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Welcome Header */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-[#ffffff] text-lg font-normal tracking-wide">Welcome to PixelForge Studio</h2>
          <div className="flex gap-2">
            <button
              onClick={handleAreaClick}
              className="bg-[#007acc] hover:bg-[#1f94e6] active:bg-[#005a9e] text-white border border-[#1a1a1a] rounded px-4 py-1.5 font-semibold text-[11px] flex items-center gap-1.5 shadow"
            >
              <Plus size={13} /> Create New...
            </button>
            <button
              onClick={handleAreaClick}
              className="bg-[#3c3c3c] hover:bg-[#4a4a4a] text-white border border-[#1a1a1a] rounded px-4 py-1.5 font-semibold text-[11px] flex items-center gap-1.5 shadow"
            >
              <FolderOpen size={13} /> Open Image...
            </button>
          </div>
        </div>

        {/* Workspace Body */}
        <div className="flex-1 flex min-h-0">
          {/* Large Clickable Upload Workspace Card */}
          <div
            onClick={handleAreaClick}
            className="flex-1 border-2 border-dashed border-[#3e3e3e] hover:border-[#007acc] bg-[#252525]/50 hover:bg-[#252525] rounded-lg flex flex-col items-center justify-center p-10 cursor-pointer transition-all shadow-inner group"
          >
            <div className="w-16 h-16 rounded-full bg-[#2b2b2b] border border-[#3e3e3e] flex items-center justify-center mb-6 group-hover:scale-105 group-hover:border-[#007acc] group-hover:shadow-[0_0_15px_rgba(0,122,204,0.2)] transition-all">
              <Upload size={24} className="text-[#8e8e8e] group-hover:text-[#007acc] transition-colors" />
            </div>

            <h3 className="text-sm font-semibold text-white mb-2">Drag and drop files here to get started</h3>
            <p className="text-[10px] text-[#8e8e8e] max-w-sm text-center leading-relaxed">
              Or click to select an image from your device. Supported formats: JPEG, PNG, BMP, WEBP, GIF (Max 10MB).
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Dual Photoshop Document Windows Layout
  return (
    <div className="w-full h-full flex p-2 gap-2 bg-[#181818] overflow-hidden">

      {/* Document 1: Original Canvas Frame */}
      <div className="flex-1 flex flex-col bg-[#2b2b2b] border border-[#1a1a1a] shadow-lg rounded overflow-hidden">

        {/* Document Tab Bar */}
        <div className="h-7 bg-[#2b2b2b] border-b border-[#1a1a1a] flex items-center justify-between px-2 shrink-0">
          <div className="flex h-full items-end">
            <div className="h-6.5 bg-[#1e1e1e] border-t border-x border-[#1a1a1a] text-white px-3 flex items-center gap-2 text-[10px] font-semibold rounded-t-sm shadow-sm">
              <FileImage size={11} className="text-[#8e8e8e]" />
              <span>Original.png @ 32.8% (Original, RGB/8)</span>
              <X size={10} className="hover:bg-[#383838] p-0.5 rounded text-[#8e8e8e] cursor-pointer hover:text-white" />
            </div>
          </div>
          <Maximize2 size={11} className="text-[#8e8e8e] hover:text-white cursor-pointer" />
        </div>

        {/* Ruler container & Image canvas */}
        <div className="flex-1 min-h-0 flex flex-col relative">

          {/* Top Ruler Bar */}
          <div className="ruler-x shrink-0 pl-[18px]">
            {renderRulerLabelsX()}
          </div>

          <div className="flex-1 min-h-0 flex relative">

            {/* Left Ruler Bar */}
            <div className="ruler-y shrink-0">
              {renderRulerLabelsY()}
            </div>

            {/* Checkerboard Image Workspace */}
            <div className="flex-1 min-h-0 flex items-center justify-center p-8 ps-canvas-bg overflow-hidden relative">
              <div className="absolute top-2 left-2 z-10 bg-black/75 border border-[#3e3e3e] text-[#8e8e8e] px-2 py-0.5 rounded text-[8px] font-mono shadow uppercase tracking-wider">
                Original Image
              </div>
              <img
                src={`data:image/png;base64,${baseOriginalImage || currentImage}`}
                alt="Original"
                className="max-w-full max-h-full object-contain shadow-[0_15px_40px_rgba(0,0,0,0.85)] border border-black z-0"
              />
            </div>
          </div>
        </div>

        {/* Small Document Status Bar */}
        <div className="h-5 bg-[#2b2b2b] border-t border-[#1a1a1a] flex items-center justify-between px-2 text-[9px] text-[#8e8e8e] shrink-0 font-mono">
          <span>32.8%</span>
          <span>Doc: Original (Base)</span>
        </div>
      </div>

      {/* Document 2: Edited Canvas Frame */}
      <div className="flex-1 flex flex-col bg-[#2b2b2b] border border-[#1a1a1a] shadow-lg rounded overflow-hidden">

        {/* Document Tab Bar */}
        <div className="h-7 bg-[#2b2b2b] border-b border-[#1a1a1a] flex items-center justify-between px-2 shrink-0">
          <div className="flex h-full items-end">
            <div className="h-6.5 bg-[#1e1e1e] border-t border-x border-[#1a1a1a] text-white px-3 flex items-center gap-2 text-[10px] font-semibold rounded-t-sm shadow-sm">
              <FileImage size={11} className="text-[#007acc]" />
              <span>Edited.png @ 32.8% (Edited, RGB/8) *</span>
              <X size={10} className="hover:bg-[#383838] p-0.5 rounded text-[#8e8e8e] cursor-pointer hover:text-white" />
            </div>
          </div>
          <Maximize2 size={11} className="text-[#8e8e8e] hover:text-white cursor-pointer" />
        </div>

        {/* Ruler container & Image canvas */}
        <div className="flex-1 min-h-0 flex flex-col relative">

          {/* Top Ruler Bar */}
          <div className="ruler-x shrink-0 pl-[18px]">
            {renderRulerLabelsX()}
          </div>

          <div className="flex-1 min-h-0 flex relative">

            {/* Left Ruler Bar */}
            <div className="ruler-y shrink-0">
              {renderRulerLabelsY()}
            </div>

            {/* Checkerboard Image Workspace */}
            <div className="flex-1 min-h-0 flex items-center justify-center p-8 ps-canvas-bg overflow-hidden relative">
              <div className="absolute top-2 left-2 z-10 bg-[#007acc]/90 border border-black text-white px-2 py-0.5 rounded text-[8px] font-mono shadow uppercase tracking-wider">
                Edited Canvas
              </div>
              <img
                src={`data:image/png;base64,${currentImage}`}
                alt="Edited"
                className="max-w-full max-h-full object-contain shadow-[0_15px_40px_rgba(0,122,204,0.35)] border border-[#007acc] z-0"
              />
            </div>
          </div>
        </div>

        {/* Small Document Status Bar */}
        <div className="h-5 bg-[#2b2b2b] border-t border-[#1a1a1a] flex items-center justify-between px-2 text-[9px] text-[#8e8e8e] shrink-0 font-mono">
          <span>32.8%</span>
          <span>Doc: Edited *</span>
        </div>
      </div>

    </div>
  );
};

export default ImageCanvas;


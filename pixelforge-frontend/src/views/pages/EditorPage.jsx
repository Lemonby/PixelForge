import React from "react";
import TopBar from "../components/TopBar";
import FilterPanel from "../components/FilterPanel";
import ImageCanvas from "../components/ImageCanvas";
import HistogramPanel from "../components/HistogramPanel";
import ImageProperties from "../components/ImageProperties";
import { useEditorController } from "../../controllers/editorController";

const EditorPage = () => {
  const { 
    currentImage, 
    baseOriginalImage,
    originalHistogram,
    originalStatistics,
    isProcessing 
  } = useEditorController();

  return (
    <div className="h-screen w-full flex flex-col bg-[#181818] text-[#b5b5b5] text-xs select-none overflow-hidden font-sans">
      {/* Top Application Bar & Options Bar */}
      <TopBar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex min-h-0 w-full relative">
        
        {/* Left Side Photoshop Panels (Original Image properties & histogram) */}
        {currentImage && (
          <aside className="w-[320px] bg-[#2b2b2b] border-r border-[#1a1a1a] flex flex-col min-h-0 shrink-0 z-20">
            
            {/* Top Panel: Original Histogram */}
            <div className="flex-1 min-h-0 border-b border-[#1a1a1a] flex flex-col overflow-hidden">
              <HistogramPanel 
                histogram={originalHistogram}
                statistics={originalStatistics}
                isProcessing={isProcessing}
                currentImage={baseOriginalImage}
                title="Original Histogram"
              />
            </div>

            {/* Bottom Panel: Original Properties */}
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <ImageProperties image={baseOriginalImage} title="Original Properties" />
            </div>

          </aside>
        )}

        {/* Central Workspace: Canvas Area */}
        <main className="flex-1 min-w-0 bg-[#1e1e1e] flex flex-col relative z-10">
          <ImageCanvas />
        </main>

        {/* Right Side Photoshop Panels Stack */}
        <aside className="w-[320px] bg-[#2b2b2b] border-l border-[#1a1a1a] flex flex-col min-h-0 shrink-0 z-20">
          
          {/* Top Panel: Histogram */}
          <div className="flex-1 min-h-0 border-b border-[#1a1a1a] flex flex-col overflow-hidden">
            <HistogramPanel />
          </div>

          {/* Middle Panel: Adjustments & Filters */}
          <div className="flex-[1.5] min-h-0 border-b border-[#1a1a1a] flex flex-col overflow-hidden">
            <FilterPanel />
          </div>

          {/* Bottom Panel: Properties / Info */}
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <ImageProperties image={currentImage} />
          </div>

        </aside>
      </div>

      {/* Bottom Status Bar */}
      <footer className="h-6 bg-[#2b2b2b] border-t border-[#1a1a1a] flex items-center justify-between px-3 text-[10px] text-[#8e8e8e] shrink-0 z-20">
        <div className="flex items-center gap-4">
          <span className="bg-[#1e1e1e] px-2 py-0.5 border border-[#1a1a1a] text-[#ffffff] font-semibold">
            {currentImage ? "32.8%" : "100.0%"}
          </span>
          <span className="text-[#8e8e8e]">
            {isProcessing ? "Executing convolution matrices..." : "Ready"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>PixelForge Engine v1.0.0</span>
          <span>Doc: {currentImage ? "1920 x 1080 px (RGB/8)" : "No image loaded"}</span>
        </div>
      </footer>
    </div>
  );
};

export default EditorPage;



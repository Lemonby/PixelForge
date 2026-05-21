import React from "react";
import TopBar from "../components/TopBar";
import FilterPanel from "../components/FilterPanel";
import ImageCanvas from "../components/ImageCanvas";
import HistogramPanel from "../components/HistogramPanel";
import ImageProperties from "../components/ImageProperties";
import { useEditorController } from "../../controllers/editorController";

const EditorPage = () => {
  const { currentImage } = useEditorController();

  return (
    <>
      {/* Ambient Orbs */}
      <div className="orb-1"></div>
      <div className="orb-2"></div>
      
      <div className="h-screen w-full flex flex-col p-6 gap-6 overflow-hidden relative z-10">
        <TopBar />

        <main className="flex-1 flex gap-6 min-h-0">
          {/* Left Sidebar - Filters */}
          <aside className="w-[340px] shrink-0">
            <FilterPanel />
          </aside>
          
          {/* Center - Image Canvas */}
          <section className="flex-1 min-w-0">
            <ImageCanvas />
          </section>

          {/* Right Sidebar - Histogram & Properties */}
          <aside className="w-[340px] shrink-0 flex flex-col gap-6 min-h-0">
            {/* Histogram Panel */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <HistogramPanel />
            </div>
            
            {/* Image Properties Panel */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <ImageProperties image={currentImage} />
            </div>
          </aside>
        </main>
      </div>
    </>
  );
};

export default EditorPage;

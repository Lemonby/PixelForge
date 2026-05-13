import React from "react";
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

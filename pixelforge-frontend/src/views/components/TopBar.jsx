import React, { useRef } from "react";
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

import React, { useRef } from "react";
import { Upload, Download, Undo, Redo, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEditorController } from "../../controllers/editorController";

const TopBar = () => {
  const navigate = useNavigate();
  const { currentImage, handleFileUpload, handleDownload, stepBack, stepForward, resetToOriginal, historyIndex, history } = useEditorController();
  const fileRef = useRef(null);

  return (
    <header className="flex justify-between items-center glass-panel px-8 py-4 shrink-0 z-10">
      <div className="flex items-center gap-5 cursor-pointer group/logo" onClick={() => navigate('/')}>
        <div className="relative flex items-center justify-center w-14 h-14 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.15)] group-hover/logo:shadow-[0_0_30px_rgba(138,43,226,0.4)] group-hover/logo:border-white/30 group-hover/logo:scale-105 transition-all duration-500">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyber-cyan/10 to-cyber-purple/10 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500"></div>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 drop-shadow-[0_0_8px_rgba(0,240,255,0.6)] group-hover/logo:drop-shadow-[0_0_15px_rgba(138,43,226,0.9)] transition-all duration-500">
            <defs>
              <linearGradient id="topFace" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="100%" stopColor="#0080ff" />
              </linearGradient>
              <linearGradient id="leftFace" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8a2be2" />
                <stop offset="100%" stopColor="#4a00e0" />
              </linearGradient>
              <linearGradient id="rightFace" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff003c" />
                <stop offset="100%" stopColor="#8a2be2" />
              </linearGradient>
            </defs>
            <path d="M12 3L22 8L12 13L2 8L12 3Z" fill="url(#topFace)" opacity="0.95" />
            <path d="M2 8V16L12 21V13L2 8Z" fill="url(#leftFace)" opacity="0.95" />
            <path d="M22 8V16L12 21V13L22 8Z" fill="url(#rightFace)" opacity="0.95" />
            
            <path d="M12 3L22 8L12 13L2 8L12 3Z" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.8" />
            <path d="M12 13V21" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.6" />
            <path d="M2 8L12 13" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.6" />
            <path d="M22 8L12 13" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.6" />
          </svg>
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-[26px] font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-cyber-cyan to-white leading-none pb-1 group-hover/logo:via-cyber-purple transition-all duration-500" style={{ backgroundSize: '200% auto' }}>
            PIXELFORGE
          </h1>
          <div className="flex items-center gap-2">
            <div className="h-[2px] w-4 bg-cyber-purple rounded-full"></div>
            <span className="text-[10px] text-cyber-purple font-bold uppercase tracking-[0.3em]">
              Studio Edition
            </span>
          </div>
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

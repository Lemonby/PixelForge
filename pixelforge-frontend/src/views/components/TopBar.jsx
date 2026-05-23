import React, { useRef, useState, useEffect } from "react";
import { 
  Upload, 
  Download, 
  Undo, 
  Redo, 
  RotateCcw, 
  FileImage, 
  Info,
  ChevronDown,
  Layout,
  AlignLeft,
  AlignCenter,
  AlignRight,
  User,
  Sliders,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEditorController } from "../../controllers/editorController";

const TopBar = () => {
  const navigate = useNavigate();
  const { 
    currentImage, 
    handleFileUpload, 
    handleDownload, 
    stepBack, 
    stepForward, 
    resetToOriginal, 
    historyIndex, 
    history 
  } = useEditorController();
  
  const fileRef = useRef(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = () => setOpenDropdown(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const toggleDropdown = (e, menuName) => {
    e.stopPropagation();
    if (openDropdown === menuName) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(menuName);
    }
  };

  return (
    <header className="flex flex-col bg-[#2b2b2b] border-b border-[#1a1a1a] select-none shrink-0 z-30">
      {/* Row 1: Application Menu Bar */}
      <div className="h-8 flex items-center justify-between px-3 border-b border-[#1a1a1a] relative">
        <div className="flex items-center gap-1.5 h-full">
          {/* Photoshop "Ps" App Logo Icon */}
          <div 
            onClick={() => navigate("/")}
            className="w-5 h-5 bg-[#001d3d] border border-[#005a9e] rounded text-[11px] font-black text-[#00a8ff] flex items-center justify-center cursor-pointer hover:bg-[#002b5c] transition-colors mr-2 shadow"
            title="PixelForge Home"
          >
            Ps
          </div>

          <input 
            type="file" 
            ref={fileRef} 
            onChange={(e) => handleFileUpload(e.target.files[0])} 
            accept="image/*" 
            className="hidden" 
          />

          {/* Menus */}
          {/* File Menu */}
          <div className="relative h-full flex items-center">
            <button 
              onClick={(e) => toggleDropdown(e, "file")}
              className={`px-3 h-full hover:bg-[#383838] hover:text-white transition-colors cursor-default flex items-center gap-1 ${
                openDropdown === "file" ? "bg-[#383838] text-white" : "text-[#cccccc]"
              }`}
            >
              File
            </button>
            {openDropdown === "file" && (
              <div className="absolute top-8 left-0 w-52 bg-[#2b2b2b] border border-[#1a1a1a] shadow-xl py-1 z-50 text-[11px] rounded-b">
                <button 
                  onClick={() => fileRef.current.click()}
                  className="w-full text-left px-4 py-2 hover:bg-[#007acc] hover:text-white flex items-center justify-between text-[#cccccc]"
                >
                  <span>Open Image...</span>
                  <span className="text-[#6e6e6e] group-hover:text-white">Ctrl+O</span>
                </button>
                <div className="h-[1px] bg-[#3e3e3e] my-1 mx-2"></div>
                <button 
                  onClick={handleDownload}
                  disabled={!currentImage}
                  className="w-full text-left px-4 py-2 hover:bg-[#007acc] hover:text-white flex items-center justify-between text-[#cccccc] disabled:opacity-30 disabled:pointer-events-none"
                >
                  <span>Save / Export...</span>
                  <span className="text-[#6e6e6e]">Ctrl+S</span>
                </button>
                <div className="h-[1px] bg-[#3e3e3e] my-1 mx-2"></div>
                <button 
                  onClick={() => navigate("/")}
                  className="w-full text-left px-4 py-2 hover:bg-[#007acc] hover:text-white text-[#cccccc]"
                >
                  <span>Close Window</span>
                </button>
              </div>
            )}
          </div>

          {/* Edit Menu */}
          <div className="relative h-full flex items-center">
            <button 
              onClick={(e) => toggleDropdown(e, "edit")}
              className={`px-3 h-full hover:bg-[#383838] hover:text-white transition-colors cursor-default flex items-center gap-1 ${
                openDropdown === "edit" ? "bg-[#383838] text-white" : "text-[#cccccc]"
              }`}
            >
              Edit
            </button>
            {openDropdown === "edit" && (
              <div className="absolute top-8 left-0 w-52 bg-[#2b2b2b] border border-[#1a1a1a] shadow-xl py-1 z-50 text-[11px] rounded-b">
                <button 
                  onClick={stepBack}
                  disabled={historyIndex <= 0}
                  className="w-full text-left px-4 py-2 hover:bg-[#007acc] hover:text-white flex items-center justify-between text-[#cccccc] disabled:opacity-30 disabled:pointer-events-none"
                >
                  <span>Undo State</span>
                  <span className="text-[#6e6e6e]">Ctrl+Z</span>
                </button>
                <button 
                  onClick={stepForward}
                  disabled={historyIndex >= history.length - 1}
                  className="w-full text-left px-4 py-2 hover:bg-[#007acc] hover:text-white flex items-center justify-between text-[#cccccc] disabled:opacity-30 disabled:pointer-events-none"
                >
                  <span>Redo State</span>
                  <span className="text-[#6e6e6e]">Ctrl+Y</span>
                </button>
                <div className="h-[1px] bg-[#3e3e3e] my-1 mx-2"></div>
                <button 
                  onClick={resetToOriginal}
                  disabled={!currentImage}
                  className="w-full text-left px-4 py-2 hover:bg-[#007acc] hover:text-white text-[#ff5a5a] disabled:opacity-30 disabled:pointer-events-none"
                >
                  <span>Reset to Original</span>
                </button>
              </div>
            )}
          </div>

          {/* Visual Dropdown Placeholders */}
          {["Image"].map((menu) => (
            <span 
              key={menu} 
              className="px-3 h-full flex items-center text-[#999999] hover:text-white hover:bg-[#383838] transition-colors cursor-default"
            >
              {menu}
            </span>
          ))}
        </div>

        {/* Right side window control mockups */}
        <div className="flex items-center gap-1">
          <span className="text-[#6e6e6e] text-[9px] uppercase tracking-wider bg-[#1e1e1e] border border-[#3e3e3e] px-1.5 py-0.5 rounded shadow">
            PixelForge Pro
          </span>
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] ml-2"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
        </div>
      </div>

      {/* Row 2: Photoshop Options Bar */}
      <div className="h-9 bg-[#2b2b2b] border-b border-[#1a1a1a] flex items-center justify-between px-3 text-[#b5b5b5] text-[11px]">
        <div className="flex items-center gap-4">
          {/* Contextual mock options block */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <input type="checkbox" id="autoSelect" defaultChecked className="accent-[#007acc]" />
              <label htmlFor="autoSelect" className="cursor-pointer">Auto-Select:</label>
            </div>
            <select className="bg-[#1e1e1e] border border-[#3e3e3e] text-white rounded px-1.5 py-0.5 outline-none text-[10px]">
              <option>Layer</option>
              <option>Group</option>
            </select>

            <div className="w-[1px] h-4 bg-[#3e3e3e]"></div>

            {/* Align mockups */}
            <div className="flex gap-1.5 text-[#8e8e8e]">
              <AlignLeft size={13} className="hover:text-white cursor-pointer" />
              <AlignCenter size={13} className="hover:text-white cursor-pointer" />
              <AlignRight size={13} className="hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Functional top bar button actions */}
        <div className="flex items-center gap-1">
          <button 
            onClick={() => fileRef.current.click()} 
            className="p-1.5 rounded hover:bg-[#383838] transition-colors text-white" 
            title="Import Image File"
          >
            <Upload size={14} />
          </button>
          
          <div className="w-[1px] h-4 bg-[#3e3e3e] mx-1"></div>

          <button 
            onClick={stepBack} 
            disabled={historyIndex <= 0} 
            className="p-1.5 rounded hover:bg-[#383838] transition-colors text-white disabled:opacity-20" 
            title="Undo"
          >
            <Undo size={14} />
          </button>
          <button 
            onClick={stepForward} 
            disabled={historyIndex >= history.length - 1} 
            className="p-1.5 rounded hover:bg-[#383838] transition-colors text-white disabled:opacity-20" 
            title="Redo"
          >
            <Redo size={14} />
          </button>

          <div className="w-[1px] h-4 bg-[#3e3e3e] mx-1"></div>

          <button 
            onClick={resetToOriginal} 
            disabled={!currentImage} 
            className="p-1.5 rounded hover:bg-[#383838] transition-colors text-[#ff5a5a] disabled:opacity-20" 
            title="Reset All Adjustments"
          >
            <RotateCcw size={14} />
          </button>

          <div className="w-[1px] h-4 bg-[#3e3e3e] mx-1"></div>

          <button 
            onClick={handleDownload} 
            disabled={!currentImage} 
            className="h-6.5 bg-[#007acc] hover:bg-[#1f94e6] disabled:opacity-30 disabled:pointer-events-none text-white border border-[#1a1a1a] rounded px-2.5 text-[10px] font-semibold flex items-center gap-1 transition-colors select-none"
            title="Download Result Image"
          >
            <Download size={12} /> Export Image
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;


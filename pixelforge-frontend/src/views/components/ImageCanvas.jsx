import React from "react";
import { useEditorController } from "../../controllers/editorController";

const ImageCanvas = () => {
  const { currentImage, baseOriginalImage } = useEditorController();

  if (!currentImage) {
    return (
      <div className="w-full h-full glass-panel flex flex-col items-center justify-center p-10 relative overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        <div className="text-center max-w-md z-10">
          <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 shadow-2xl backdrop-blur-md">
            <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-cyber-cyan animate-spin-slow"></div>
            <div className="absolute w-8 h-8 rounded-full border-b-2 border-l-2 border-cyber-purple animate-spin-reverse-slow"></div>
          </div>
          <h2 className="text-3xl font-light text-white mb-3 tracking-wide">Forge Your Vision</h2>
          <p className="text-cyber-muted text-sm leading-relaxed font-light">
            Experience premium digital image processing. Upload an image to initialize the workspace.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-6">
      {/* Original Image Panel */}
      <div className="flex-1 glass-panel relative overflow-hidden flex flex-col items-center justify-center p-6 shadow-[inset_0_0_50px_rgba(0,0,0,0.3)] group transition-all duration-300 hover:border-white/10">
        <div className="absolute top-4 left-4 z-20 bg-black/40 backdrop-blur-xl text-white/90 px-4 py-1.5 rounded-full text-xs font-semibold border border-white/10 shadow-lg tracking-wider uppercase">
          Original
        </div>
        {/* Background Checkerboard for transparency indication */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'conic-gradient(white 90deg, transparent 90deg 180deg, white 180deg 270deg, transparent 270deg 360deg)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}></div>

        <img
          src={`data:image/png;base64,${baseOriginalImage || currentImage}`}
          alt="Original"
          className="max-w-full max-h-full object-contain rounded-lg drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover:scale-[1.02] z-10"
        />
      </div>

      {/* Edited Image Panel */}
      <div className="flex-1 glass-panel relative overflow-hidden flex flex-col items-center justify-center p-6 shadow-[inset_0_0_80px_rgba(0,240,255,0.05)] border-cyber-cyan/20 group transition-all duration-300 hover:border-cyber-cyan/40 hover:shadow-[inset_0_0_100px_rgba(0,240,255,0.08)]">
        <div className="absolute top-4 left-4 z-20 bg-cyber-cyan/10 text-cyber-cyan backdrop-blur-xl px-4 py-1.5 rounded-full text-xs font-semibold border border-cyber-cyan/30 shadow-[0_0_15px_rgba(0,240,255,0.2)] tracking-wider uppercase">
          Edited
        </div>
        {/* Background Checkerboard for transparency indication */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'conic-gradient(white 90deg, transparent 90deg 180deg, white 180deg 270deg, transparent 270deg 360deg)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}></div>

        <img
          src={`data:image/png;base64,${currentImage}`}
          alt="Edited"
          className="max-w-full max-h-full object-contain rounded-lg drop-shadow-[0_20px_50px_rgba(0,240,255,0.15)] transition-transform duration-500 group-hover:scale-[1.02] z-10"
        />
      </div>
    </div>
  );
};

export default ImageCanvas;

import React, { useEffect, useState } from "react";
import { Info, FileText } from "lucide-react";

const ImageProperties = ({ image, title = "Properties" }) => {
  const [properties, setProperties] = useState({
    width: 0,
    height: 0,
    fileSize: "0 KB",
    colorSpace: "RGB",
    bitDepth: 24,
    aspectRatio: "0",
    pixels: 0,
  });

  useEffect(() => {
    if (!image) return;

    const img = new Image();
    img.onload = () => {
      // Calculate file size from base64
      const binaryString = atob(image);
      const bytes = binaryString.length;
      
      // Format size
      let fileSize = bytes;
      let sizeUnit = "B";
      if (bytes > 1024 * 1024) {
        fileSize = (bytes / (1024 * 1024)).toFixed(2);
        sizeUnit = "MB";
      } else if (bytes > 1024) {
        fileSize = (bytes / 1024).toFixed(2);
        sizeUnit = "KB";
      }

      setProperties({
        width: img.width,
        height: img.height,
        pixels: img.width * img.height,
        fileSize: `${fileSize} ${sizeUnit}`,
        colorSpace: "RGB",
        bitDepth: 24,
        aspectRatio: (img.width / img.height).toFixed(2),
      });
    };
    img.src = `data:image/png;base64,${image}`;
  }, [image]);

  if (!image) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[#8e8e8e] text-center p-6 bg-[#2b2b2b]">
        <Info size={32} className="opacity-25 mb-3" />
        <span className="text-[11px] font-medium leading-relaxed max-w-[200px]">
          No active document to inspect {title.toLowerCase()}
        </span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#2b2b2b] select-none h-full overflow-hidden">
      {/* Panel Header */}
      <div className="ps-panel-header shrink-0">
        <div className="flex items-center gap-1.5">
          <Info size={12} className="text-[#007acc]" />
          <span>{title}</span>
        </div>
      </div>

      {/* Info List Body */}
      <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
        
        {/* Document Sizing Section */}
        <div className="border border-[#1a1a1a] rounded bg-[#202020] p-2.5">
          <div className="flex items-center gap-1.5 mb-2.5 pb-1 border-b border-[#2c2c2c] text-[10px] font-bold text-white uppercase tracking-wider">
            <FileText size={11} className="text-[#8e8e8e]" />
            <span>Document Info</span>
          </div>

          <div className="space-y-1.5 text-[10.5px] text-[#8e8e8e]">
            <div className="flex justify-between border-b border-[#2c2c2c]/40 pb-1">
              <span>Dimensions:</span>
              <span className="text-white font-semibold font-mono">
                {properties.width} × {properties.height} px
              </span>
            </div>
            
            <div className="flex justify-between border-b border-[#2c2c2c]/40 pb-1">
              <span>Aspect Ratio:</span>
              <span className="text-white font-semibold font-mono">
                {properties.aspectRatio}:1
              </span>
            </div>

            <div className="flex justify-between border-b border-[#2c2c2c]/40 pb-1">
              <span>Total Pixels:</span>
              <span className="text-white font-semibold font-mono">
                {properties.pixels ? properties.pixels.toLocaleString() : "0"}
              </span>
            </div>

            <div className="flex justify-between border-b border-[#2c2c2c]/40 pb-1">
              <span>File Size:</span>
              <span className="text-white font-semibold font-mono">
                {properties.fileSize}
              </span>
            </div>

            <div className="flex justify-between border-b border-[#2c2c2c]/40 pb-1">
              <span>Color Space:</span>
              <span className="text-white font-semibold font-mono">
                {properties.colorSpace}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Bit Depth:</span>
              <span className="text-white font-semibold font-mono">
                {properties.bitDepth}-bit (8bpc)
              </span>
            </div>
          </div>
        </div>

        {/* System Info Note */}
        <div className="text-[9px] text-[#6e6e6e] leading-normal px-0.5">
          File attributes are computed client-side upon rendering the decoded Base64 pixel buffer array.
        </div>

      </div>
    </div>
  );
};

export default ImageProperties;


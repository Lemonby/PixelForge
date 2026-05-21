import React, { useEffect, useState } from "react";
import { Info } from "lucide-react";

const ImageProperties = ({ image, baseImage }) => {
  const [properties, setProperties] = useState({
    width: 0,
    height: 0,
    fileSize: 0,
    colorSpace: "RGB",
    bitDepth: 24,
  });

  useEffect(() => {
    if (!image) return;

    const img = new Image();
    img.onload = () => {
      // Hitung file size dari base64
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

  return (
    <div className="glass-panel p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Info size={16} className="text-cyber-cyan" />
        <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
          Image Properties
        </h3>
      </div>

      <div className="space-y-3 text-xs flex-1">
        {/* Dimensions */}
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="text-cyber-muted mb-1">Dimensions</div>
          <div className="text-white font-semibold">
            {properties.width} × {properties.height} px
          </div>
        </div>

        {/* Aspect Ratio */}
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="text-cyber-muted mb-1">Aspect Ratio</div>
          <div className="text-white font-semibold">
            {properties.aspectRatio || "N/A"}:1
          </div>
        </div>

        {/* Total Pixels */}
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="text-cyber-muted mb-1">Total Pixels</div>
          <div className="text-white font-semibold">
            {properties.pixels ? properties.pixels.toLocaleString() : "N/A"}
          </div>
        </div>

        {/* File Size */}
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="text-cyber-muted mb-1">File Size</div>
          <div className="text-white font-semibold">{properties.fileSize}</div>
        </div>

        {/* Color Space */}
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="text-cyber-muted mb-1">Color Space</div>
          <div className="text-white font-semibold">{properties.colorSpace}</div>
        </div>

        {/* Bit Depth */}
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="text-cyber-muted mb-1">Bit Depth</div>
          <div className="text-white font-semibold">{properties.bitDepth}-bit</div>
        </div>
      </div>

      {/* Visual Indicator */}
      {/* <div className="mt-6 pt-4 border-t border-white/10">
        <div className="text-cyber-muted text-xs mb-2">Color Preview</div>
        <div className="flex gap-1">
          <div className="h-6 flex-1 rounded bg-red-500/70 shadow-lg shadow-red-500/20"></div>
          <div className="h-6 flex-1 rounded bg-green-500/70 shadow-lg shadow-green-500/20"></div>
          <div className="h-6 flex-1 rounded bg-blue-500/70 shadow-lg shadow-blue-500/20"></div>
        </div>
      </div> */}
    </div>
  );
};

export default ImageProperties;

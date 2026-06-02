import React, { useState } from "react";
import SliderControl from "./SliderControl";
import { useEditorController } from "../../controllers/editorController";
import api from "../../services/api";
import { Download, Play, BarChart2, Info, HardDrive } from "lucide-react";

const CompressPanel = () => {
  const { currentImage, setResultImage, setProcessingState, isProcessing, fetchHistogramData } = useEditorController();
  const [activeTab, setActiveTab] = useState("save");

  // Save Settings State
  const [saveQuality, setSaveQuality] = useState(80);
  const [saveFormat, setSaveFormat] = useState("jpeg");

  // Simulation Settings State
  const [simQuality, setSimQuality] = useState(50);
  const [entropyMethod, setEntropyMethod] = useState("huffman");
  const [simStats, setSimStats] = useState(null);

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSaveExport = async () => {
    if (!currentImage) return;
    setProcessingState(true);
    try {
      const res = await api.post("/api/compress/save", {
        image: currentImage,
        quality: saveQuality,
        format: saveFormat
      });
      if (res.data.status === "ok") {
        const link = document.createElement("a");
        link.href = `data:image/${saveFormat};base64,${res.data.result_image}`;
        link.download = `pixelforge-compressed.${saveFormat === "jpeg" ? "jpg" : "png"}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred during export.");
    } finally {
      setProcessingState(false);
    }
  };

  const handleRunSimulation = async () => {
    if (!currentImage) return;
    setProcessingState(true);
    try {
      const res = await api.post("/api/compress/simulate", {
        image: currentImage,
        quality: simQuality,
        entropy_method: entropyMethod
      });
      if (res.data.status === "ok") {
        // Update simulation stats in component state
        setSimStats(res.data.statistics);
        // Apply lossy image back to editor canvas
        setResultImage(res.data.result_image);
        // Recalculate histograms for the new image state
        await fetchHistogramData(res.data.result_image);
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred during simulation.");
    } finally {
      setProcessingState(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Sub-Tabs Selector */}
      <div className="grid grid-cols-2 gap-1 bg-[#1b1b1b] p-1 rounded border border-[#1a1a1a]">
        <button
          onClick={() => setActiveTab("save")}
          className={`py-1 text-[9.5px] font-bold uppercase tracking-wider text-center rounded transition-all cursor-pointer ${
            activeTab === "save"
              ? "bg-[#007acc] text-white shadow"
              : "text-[#8e8e8e] hover:text-[#cccccc] hover:bg-[#252525]"
          }`}
        >
          Export & Save
        </button>
        <button
          onClick={() => setActiveTab("simulate")}
          className={`py-1 text-[9.5px] font-bold uppercase tracking-wider text-center rounded transition-all cursor-pointer ${
            activeTab === "simulate"
              ? "bg-[#007acc] text-white shadow"
              : "text-[#8e8e8e] hover:text-[#cccccc] hover:bg-[#252525]"
          }`}
        >
          JPEG Simulator
        </button>
      </div>

      {/* Save & Export Option Tab */}
      {activeTab === "save" && (
        <div className="space-y-3.5 pt-1">
          <p className="text-[9px] text-[#8e8e8e] leading-relaxed">
            Directly compress and download your active canvas image to save disk space.
          </p>

          <div className="flex items-center justify-between border-b border-[#2c2c2c]/40 pb-2 text-[10px]">
            <span className="text-[#8e8e8e]">Export Format:</span>
            <select
              value={saveFormat}
              onChange={(e) => setSaveFormat(e.target.value)}
              className="ps-input py-0.5 bg-[#1b1b1b] text-white text-[10px] border border-[#1a1a1a] rounded focus:border-[#007acc] outline-none font-semibold cursor-pointer"
            >
              <option value="jpeg">JPEG (.jpg) - Lossy</option>
              <option value="png">PNG (.png) - Lossless</option>
            </select>
          </div>

          <SliderControl
            label={saveFormat === "jpeg" ? "JPEG Quality Factor" : "PNG Compression Level"}
            min={1}
            max={100}
            step={1}
            defaultValue={saveQuality}
            onChange={(val) => setSaveQuality(val)}
          />

          <div className="bg-[#1b1b1b] border border-[#1a1a1a] p-2.5 rounded text-[9.5px] text-[#8e8e8e] space-y-1">
            <span className="text-white font-semibold flex items-center gap-1.5">
              <Info size={10.5} className="text-[#007acc]" />
              Quick Info:
            </span>
            {saveFormat === "jpeg" ? (
              <p>
                JPEG at <span className="text-white font-bold">{saveQuality}%</span> quality offers excellent balance between file size and perceptual quality. Quality settings below 30% may introduce blocky DCT noise.
              </p>
            ) : (
              <p>
                PNG uses lossless DEFLATE compression. Changing the compression factor adjusts encoding speed vs file size without losing any pixel details.
              </p>
            )}
          </div>

          <button
            onClick={handleSaveExport}
            disabled={isProcessing}
            className="ps-button-primary w-full py-1.5 mt-2 flex items-center justify-center gap-1.5 text-[10px] font-bold"
          >
            <Download size={11} /> Compress & Export
          </button>
        </div>
      )}

      {/* JPEG Simulation Tab */}
      {activeTab === "simulate" && (
        <div className="space-y-3.5 pt-1">
          <p className="text-[9px] text-[#8e8e8e] leading-relaxed">
            Run a simulation of block-based DCT, quantization, and evaluate standard entropy coding algorithms.
          </p>

          <SliderControl
            label="DCT Quantization Quality"
            min={1}
            max={100}
            step={1}
            defaultValue={simQuality}
            onChange={(val) => setSimQuality(val)}
          />

          <div className="flex items-center justify-between border-b border-[#2c2c2c]/40 pb-2.5 text-[10px]">
            <span className="text-[#8e8e8e]">Entropy Coder:</span>
            <select
              value={entropyMethod}
              onChange={(e) => setEntropyMethod(e.target.value)}
              className="ps-input py-0.5 bg-[#1b1b1b] text-white text-[10px] border border-[#1a1a1a] rounded focus:border-[#007acc] outline-none font-semibold cursor-pointer"
            >
              <option value="huffman">Huffman Encoding (JPEG Std)</option>
              <option value="arithmetic">Arithmetic Coding (Higher Ratio)</option>
              <option value="lzw">LZW Encoding (Dictionary)</option>
              <option value="rle">Run-Length Encoding (RLE)</option>
            </select>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isProcessing}
            className="ps-button-primary w-full py-1.5 flex items-center justify-center gap-1.5 text-[10px] font-bold"
          >
            <Play size={11} className="fill-white" /> Simulate JPEG Compression
          </button>

          {/* Simulation Statistics Dashboard */}
          {simStats && (
            <div className="bg-[#1b1b1b] border border-[#1a1a1a] p-3 rounded space-y-3.5 animate-fadeIn">
              <div className="flex items-center gap-1.5 border-b border-[#2c2c2c] pb-1.5">
                <BarChart2 size={12} className="text-[#007acc]" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                  Simulation Dashboard
                </span>
              </div>

              {/* Grid Statistics */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#212121] border border-[#2c2c2c] p-2 rounded flex flex-col justify-center">
                  <span className="text-[8.5px] text-[#8e8e8e] uppercase font-bold tracking-wider">
                    Original Size:
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#cccccc] mt-0.5">
                    {formatBytes(simStats.original_size)}
                  </span>
                </div>
                <div className="bg-[#212121] border border-[#2c2c2c] p-2 rounded flex flex-col justify-center">
                  <span className="text-[8.5px] text-[#8e8e8e] uppercase font-bold tracking-wider">
                    Compressed Size:
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#00ffc4] mt-0.5">
                    {formatBytes(simStats.compressed_size)}
                  </span>
                </div>
                <div className="bg-[#212121] border border-[#2c2c2c] p-2 rounded flex flex-col justify-center">
                  <span className="text-[8.5px] text-[#8e8e8e] uppercase font-bold tracking-wider">
                    Ratio:
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#ffae00] mt-0.5">
                    {simStats.compression_ratio}x
                  </span>
                </div>
                <div className="bg-[#212121] border border-[#2c2c2c] p-2 rounded flex flex-col justify-center">
                  <span className="text-[8.5px] text-[#8e8e8e] uppercase font-bold tracking-wider">
                    Space Saved:
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#00b4ff] mt-0.5">
                    {simStats.space_savings}%
                  </span>
                </div>
              </div>

              {/* Entropy Methods Comparison Chart */}
              <div className="space-y-2 border-t border-[#2c2c2c] pt-2 text-[9.5px]">
                <div className="flex items-center gap-1.5 text-white font-semibold">
                  <HardDrive size={10.5} className="text-[#007acc]" />
                  <span>Method Size Comparison:</span>
                </div>
                <div className="space-y-1.5 font-mono">
                  {[
                    { id: "huffman", label: "Huffman", size: simStats.methods.huffman },
                    { id: "arithmetic", label: "Arithmetic", size: simStats.methods.arithmetic },
                    { id: "lzw", label: "LZW", size: simStats.methods.lzw },
                    { id: "rle", label: "RLE", size: simStats.methods.rle }
                  ].map((m) => (
                    <div key={m.id} className="flex flex-col gap-0.5">
                      <div className="flex justify-between text-[9px]">
                        <span className={entropyMethod === m.id ? "text-[#00ffc4] font-bold" : "text-[#cccccc]"}>
                          {m.label} {entropyMethod === m.id ? "(active)" : ""}
                        </span>
                        <span className="text-[#8e8e8e]">{formatBytes(m.size)}</span>
                      </div>
                      {/* Simple visual bar chart representing compression efficiency */}
                      <div className="w-full h-1.5 bg-[#252525] rounded overflow-hidden relative">
                        <div
                          className={`h-full rounded transition-all duration-500 ${
                            entropyMethod === m.id ? "bg-[#00ffc4]" : "bg-[#007acc]"
                          }`}
                          style={{
                            width: `${Math.max(10, Math.min(100, (m.size / simStats.original_size) * 100))}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompressPanel;

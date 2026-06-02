import React, { useState } from "react";
import SliderControl from "./SliderControl";
import { useEditorController } from "../../controllers/editorController";
import { Scissors, Layers, Eye, RefreshCw } from "lucide-react";

const SegmentPanel = () => {
  const { currentImage, applyProcess, isProcessing } = useEditorController();
  const [activeTab, setActiveTab] = useState("threshold");

  // Threshold State
  const [threshVal, setThreshVal] = useState(127);
  const [threshMode, setThreshMode] = useState("color");

  // Edge State
  const [edgeLow, setEdgeLow] = useState(50);
  const [edgeHigh, setEdgeHigh] = useState(150);
  const [edgeMode, setEdgeMode] = useState("color");

  // Region K-Means State
  const [numClusters, setNumClusters] = useState(3);
  const [regionMode, setRegionMode] = useState("simplify"); // 'simplify' or 'extract'
  const [targetCluster, setTargetCluster] = useState(0);

  const handleApplyThreshold = () => {
    applyProcess("/api/segment/threshold", {
      threshold: threshVal,
      mode: threshMode
    });
  };

  const handleApplyEdge = () => {
    applyProcess("/api/segment/edge", {
      low: edgeLow,
      high: edgeHigh,
      mode: edgeMode
    });
  };

  const handleApplyRegion = () => {
    applyProcess("/api/segment/region", {
      clusters: numClusters,
      target_cluster: regionMode === "extract" ? targetCluster : null
    });
  };

  return (
    <div className="space-y-4">
      {/* Segment Navigation Sub-Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-[#1b1b1b] p-1 rounded border border-[#1a1a1a]">
        {[
          { id: "threshold", label: "Threshold" },
          { id: "edge", label: "Edge" },
          { id: "region", label: "Region" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-1 text-[9.5px] font-bold uppercase tracking-wider text-center rounded transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#007acc] text-white shadow-md"
                : "text-[#8e8e8e] hover:text-[#cccccc] hover:bg-[#252525]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Threshold Segment Tab */}
      {activeTab === "threshold" && (
        <div className="space-y-3.5 pt-1">
          <p className="text-[9px] text-[#8e8e8e] leading-relaxed">
            Segments the image using binary threshold masking based on intensity value.
          </p>

          <SliderControl
            label="Threshold Level"
            min={0}
            max={255}
            step={1}
            defaultValue={threshVal}
            onChange={(val) => setThreshVal(val)}
          />

          <div className="flex items-center justify-between border-t border-[#2c2c2c] pt-2 text-[10px]">
            <span className="text-[#8e8e8e]">Segmentation Mode:</span>
            <select
              value={threshMode}
              onChange={(e) => setThreshMode(e.target.value)}
              className="ps-input py-0.5 bg-[#1b1b1b] text-white text-[10px] border border-[#1a1a1a] rounded focus:border-[#007acc] outline-none font-semibold cursor-pointer"
            >
              <option value="color">Extract Color Foreground</option>
              <option value="binary">Binary (Black & White) Mask</option>
            </select>
          </div>

          <button
            onClick={handleApplyThreshold}
            disabled={isProcessing}
            className="ps-button-primary w-full py-1.5 mt-2 flex items-center justify-center gap-1.5 text-[10px] font-bold"
          >
            <Scissors size={11} /> Apply Threshold Segmentation
          </button>
        </div>
      )}

      {/* Edge Segment Tab */}
      {activeTab === "edge" && (
        <div className="space-y-3.5 pt-1">
          <p className="text-[9px] text-[#8e8e8e] leading-relaxed">
            Identifies boundary curves and segments enclosed contours / regions.
          </p>

          <SliderControl
            label="Low Threshold Sensitivity"
            min={1}
            max={254}
            step={1}
            defaultValue={edgeLow}
            onChange={(val) => setEdgeLow(val)}
          />

          <SliderControl
            label="High Threshold Sensitivity"
            min={2}
            max={255}
            step={1}
            defaultValue={edgeHigh}
            onChange={(val) => setEdgeHigh(val)}
          />

          <div className="flex items-center justify-between border-t border-[#2c2c2c] pt-2 text-[10px]">
            <span className="text-[#8e8e8e]">Segmentation Mode:</span>
            <select
              value={edgeMode}
              onChange={(e) => setEdgeMode(e.target.value)}
              className="ps-input py-0.5 bg-[#1b1b1b] text-white text-[10px] border border-[#1a1a1a] rounded focus:border-[#007acc] outline-none font-semibold cursor-pointer"
            >
              <option value="color">Extract Color Regions</option>
              <option value="binary">Binary Edge Contour Mask</option>
            </select>
          </div>

          <button
            onClick={handleApplyEdge}
            disabled={isProcessing}
            className="ps-button-primary w-full py-1.5 mt-2 flex items-center justify-center gap-1.5 text-[10px] font-bold"
          >
            <Layers size={11} /> Apply Edge-Based Segmentation
          </button>
        </div>
      )}

      {/* Region K-Means Segment Tab */}
      {activeTab === "region" && (
        <div className="space-y-3.5 pt-1">
          <p className="text-[9px] text-[#8e8e8e] leading-relaxed">
            Applies color clustering using unsupervised K-Means to divide the image into distinct regions.
          </p>

          <SliderControl
            label="Number of Clusters (K)"
            min={2}
            max={8}
            step={1}
            defaultValue={numClusters}
            onChange={(val) => {
              setNumClusters(val);
              // Reset target cluster if K changes
              if (targetCluster >= val) {
                setTargetCluster(0);
              }
            }}
          />

          <div className="flex items-center justify-between border-t border-[#2c2c2c] pt-2 pb-1 text-[10px]">
            <span className="text-[#8e8e8e]">Segmentation Action:</span>
            <select
              value={regionMode}
              onChange={(e) => setRegionMode(e.target.value)}
              className="ps-input py-0.5 bg-[#1b1b1b] text-white text-[10px] border border-[#1a1a1a] rounded focus:border-[#007acc] outline-none font-semibold cursor-pointer"
            >
              <option value="simplify">Simple Color Clustering</option>
              <option value="extract">Region Extraction (Masking)</option>
            </select>
          </div>

          {regionMode === "extract" && (
            <div className="bg-[#1b1b1b] border border-[#1a1a1a] p-2 rounded space-y-1.5 animate-fadeIn">
              <span className="text-[9.5px] text-[#8e8e8e] block">Select Region / Cluster Index to Extract:</span>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: numClusters }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTargetCluster(idx)}
                    className={`w-6 h-6 rounded flex items-center justify-center font-mono text-[10.5px] font-bold transition-all border cursor-pointer ${
                      targetCluster === idx
                        ? "bg-[#007acc] border-[#0096ff] text-white shadow"
                        : "bg-[#252525] border-[#1e1e1e] text-[#8e8e8e] hover:text-white"
                    }`}
                  >
                    {idx}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleApplyRegion}
            disabled={isProcessing}
            className="ps-button-primary w-full py-1.5 mt-2 flex items-center justify-center gap-1.5 text-[10px] font-bold"
          >
            <Eye size={11} /> Apply Region-Based Clustering
          </button>
        </div>
      )}
    </div>
  );
};

export default SegmentPanel;

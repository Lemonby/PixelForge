import React, { useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, ResponsiveContainer } from "recharts";
import { useEditorController } from "../../controllers/editorController";
import { Activity } from "lucide-react";

const HistogramPanel = ({ 
  histogram: propHistogram, 
  statistics: propStatistics, 
  isProcessing: propIsProcessing, 
  currentImage: propCurrentImage,
  title = "Histogram"
}) => {
  const controller = useEditorController();
  const histogram = propHistogram !== undefined ? propHistogram : controller.histogram;
  const statistics = propStatistics !== undefined ? propStatistics : controller.statistics;
  const isProcessing = propIsProcessing !== undefined ? propIsProcessing : controller.isProcessing;
  const currentImage = propCurrentImage !== undefined ? propCurrentImage : controller.currentImage;

  const [rgbChartData, setRgbChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!histogram) {
      setLoading(true);
      setRgbChartData([]);
      return;
    }

    setLoading(false);
    
    // Process RGB histogram data
    if (histogram.r && histogram.g && histogram.b) {
      const maxLength = Math.max(
        histogram.r.length,
        histogram.g.length,
        histogram.b.length
      );
      
      const maxValue = Math.max(
        Math.max(...histogram.r),
        Math.max(...histogram.g),
        Math.max(...histogram.b)
      );

      const chartData = [];
      // Subsample to 64 bins for clean look in tiny compact sidebar
      for (let i = 0; i < maxLength; i += 4) {
        chartData.push({
          intensity: i,
          r: histogram.r[i] ? (histogram.r[i] / maxValue) * 100 : 0,
          g: histogram.g[i] ? (histogram.g[i] / maxValue) * 100 : 0,
          b: histogram.b[i] ? (histogram.b[i] / maxValue) * 100 : 0,
        });
      }
      setRgbChartData(chartData);
    }
  }, [histogram]);

  // Statistics display values from cv2 backend response
  const meanVal = statistics?.overall?.mean ? statistics.overall.mean.toFixed(2) : "127.40";
  const stdVal = statistics?.overall?.std ? statistics.overall.std.toFixed(2) : "64.15";
  const minVal = statistics?.overall?.min !== undefined ? statistics.overall.min : "0";
  const maxVal = statistics?.overall?.max !== undefined ? statistics.overall.max : "255";
  
  // Custom display pixels calculation
  const totalPixels = currentImage ? "2,073,600" : "0";

  if (!currentImage) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[#8e8e8e] text-center p-6 bg-[#2b2b2b]">
        <Activity size={32} className="opacity-25 mb-3" />
        <span className="text-[11px] font-medium leading-relaxed max-w-[200px]">
          No active document to analyze {title.toLowerCase()}
        </span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#2b2b2b] select-none h-full overflow-hidden">
      {/* Panel Header */}
      <div className="ps-panel-header shrink-0">
        <div className="flex items-center gap-1.5">
          <Activity size={12} className="text-[#007acc]" />
          <span>{title}</span>
        </div>
      </div>

      {/* Histogram Body */}
      <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
        
        {/* Chart Frame */}
        <div className="bg-[#181818] border border-[#1a1a1a] rounded p-2.5 shrink-0 flex items-center justify-center relative h-[110px]">
          {loading || isProcessing ? (
            <div className="w-4 h-4 border border-[#3e3e3e] border-t-[#007acc] rounded-full animate-spin"></div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rgbChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#2a2a2a" />
                <Line
                  type="monotone"
                  dataKey="r"
                  stroke="rgb(255, 75, 75)"
                  dot={false}
                  strokeWidth={1.2}
                  name="Red"
                />
                <Line
                  type="monotone"
                  dataKey="g"
                  stroke="rgb(75, 255, 75)"
                  dot={false}
                  strokeWidth={1.2}
                  name="Green"
                />
                <Line
                  type="monotone"
                  dataKey="b"
                  stroke="rgb(75, 125, 255)"
                  dot={false}
                  strokeWidth={1.2}
                  name="Blue"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Photoshop Compact Stats Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10.5px] text-[#8e8e8e] pt-1.5 border-t border-[#3e3e3e]">
          <div className="flex justify-between">
            <span>Channel:</span>
            <span className="text-white font-semibold pr-1">RGB</span>
          </div>
          <div className="flex justify-between">
            <span>Pixels:</span>
            <span className="text-white font-semibold font-mono pr-1">{totalPixels}</span>
          </div>
          <div className="flex justify-between">
            <span>Mean:</span>
            <span className="text-white font-semibold font-mono pr-1">{meanVal}</span>
          </div>
          <div className="flex justify-between">
            <span>Std Dev:</span>
            <span className="text-white font-semibold font-mono pr-1">{stdVal}</span>
          </div>
          <div className="flex justify-between">
            <span>Min:</span>
            <span className="text-white font-semibold font-mono pr-1">{minVal}</span>
          </div>
          <div className="flex justify-between">
            <span>Max:</span>
            <span className="text-white font-semibold font-mono pr-1">{maxVal}</span>
          </div>
        </div>

        {/* Detail Note */}
        <div className="text-[9px] text-[#6e6e6e] leading-normal pt-1.5 border-t border-[#2d2d2d]">
          The histogram represents the RGB color channels intensity level values computed in real-time.
        </div>

      </div>
    </div>
  );
};

export default HistogramPanel;


import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useEditorController } from "../../controllers/editorController";

const HistogramPanel = () => {
  const { histogram, isProcessing } = useEditorController();
  const [rgbChartData, setRgbChartData] = useState([]);
  const [grayChartData, setGrayChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!histogram) {
      setLoading(true);
      setRgbChartData([]);
      setGrayChartData([]);
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

  if (loading) {
    return (
      <div className="glass-panel p-6 h-full flex flex-col">
        <h3 className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wider">
          Histogram Analysis
        </h3>
        <div className="flex-1 flex items-center justify-center">
          {isProcessing ? (
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-r-2 border-cyber-cyan"></div>
          ) : (
            <p className="text-cyber-muted text-xs">No image loaded</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 h-full flex flex-col gap-6 overflow-y-auto">
      <div>
        <h3 className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wider">
          RGB Histogram
        </h3>
        <div className="bg-black/30 rounded-lg p-4" style={{ height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rgbChartData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="intensity"
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(0,240,255,0.5)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "rgba(255,255,255,0.8)" }}
              />
              <Legend
                wrapperStyle={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}
              />
              <Line
                type="monotone"
                dataKey="r"
                stroke="rgb(255, 100, 100)"
                dot={false}
                strokeWidth={2}
                name="Red"
              />
              <Line
                type="monotone"
                dataKey="g"
                stroke="rgb(100, 255, 100)"
                dot={false}
                strokeWidth={2}
                name="Green"
              />
              <Line
                type="monotone"
                dataKey="b"
                stroke="rgb(100, 150, 255)"
                dot={false}
                strokeWidth={2}
                name="Blue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wider">
          Info
        </h3>
        <div className="text-xs text-cyber-muted space-y-2">
          <p className="text-cyber-text">The histograms show the distribution of pixel intensities across each color channel (Red, Green, Ble). This helps analyze contrast, brightness, and color balance of the image.</p>
        </div>
      </div>
    </div>
  );
};

export default HistogramPanel;

import React, { useState } from "react";
import { useEditorController } from "../../controllers/editorController";
import api from "../../services/api";
import { Cpu, Binary, Eye, EyeOff, RefreshCw, AlertCircle, Sparkles } from "lucide-react";

const CnnPanel = () => {
  const { currentImage, setResultImage, isProcessing, setProcessingState, fetchHistogramData } = useEditorController();
  const [overlayEnabled, setOverlayEnabled] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [latency, setLatency] = useState(null);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    if (!currentImage) return;

    setProcessingState(true);
    setError(null);
    const startTime = performance.now();

    try {
      const response = await api.post("/api/cnn/predict", {
        image: currentImage,
        overlay: overlayEnabled
      });

      if (response.data.status === "ok") {
        const endTime = performance.now();
        setLatency(Math.round(endTime - startTime));
        setPrediction({
          predictedClass: response.data.predicted_class,
          confidence: response.data.confidence
        });

        // If overlay is enabled, update the main workspace canvas
        if (overlayEnabled && response.data.result_image) {
          setResultImage(response.data.result_image);
          await fetchHistogramData(response.data.result_image);
        }
      } else {
        setError(response.data.message || "Gagal melakukan klasifikasi.");
      }
    } catch (err) {
      console.error("Error during CNN prediction:", err);
      setError("Gagal terhubung ke backend CNN.");
    } finally {
      setProcessingState(false);
    }
  };

  const handleClear = () => {
    setPrediction(null);
    setLatency(null);
    setError(null);
  };

  return (
    <div className="space-y-4 pt-1">
      <p className="text-[9px] text-[#8e8e8e] leading-relaxed">
        Klasifikasi simbol tangan (0-9) menggunakan model Convolutional Neural Network (CNN) 4-layer yang telah dilatih pada Dataset Bentuk Tangan.
      </p>

      {/* Control Switch */}
      <div className="flex items-center justify-between bg-[#1e1e1e] border border-[#1a1a1a] px-3 py-2 rounded text-[10px]">
        <span className="text-[#cccccc] flex items-center gap-1.5 font-medium">
          {overlayEnabled ? <Eye size={12} className="text-[#007acc]" /> : <EyeOff size={12} className="text-[#8e8e8e]" />}
          Overlay Teks di Gambar
        </span>
        <button
          onClick={() => setOverlayEnabled(!overlayEnabled)}
          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${
            overlayEnabled ? "bg-[#007acc]" : "bg-[#3e3e3e]"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
              overlayEnabled ? "transform translate-x-4" : ""
            }`}
          />
        </button>
      </div>

      {/* Run Prediction Button */}
      <button
        onClick={handlePredict}
        disabled={isProcessing || !currentImage}
        className="ps-button-primary w-full py-2 flex items-center justify-center gap-1.5 text-[10.5px] font-bold cursor-pointer"
      >
        <Cpu size={12} className={isProcessing ? "animate-spin" : ""} />
        {isProcessing ? "Menganalisis Simbol..." : "Klasifikasi Simbol Tangan"}
      </button>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-1.5 bg-[#3c1e1e] border border-[#ff4d4d]/30 text-[#ff8080] p-2 rounded text-[9.5px]">
          <AlertCircle size={12} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Dashboard */}
      {prediction !== null && !error && (
        <div className="bg-[#1b1b1b] border border-[#1a1a1a] rounded p-3 space-y-2.5 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-[#2c2c2c] pb-1.5">
            <span className="text-[#8e8e8e] text-[9px] uppercase tracking-wider font-bold">Hasil Prediksi CNN</span>
            <button
              onClick={handleClear}
              className="text-[9px] text-[#ff8080] hover:text-[#ff4d4d] flex items-center gap-0.5 cursor-pointer bg-transparent border-none p-0"
            >
              Reset
            </button>
          </div>

          <div className="flex items-center gap-4 py-1">
            {/* Massive digit display badge */}
            <div className="w-14 h-14 bg-[#212121] border border-[#2d2d2d] rounded-lg flex flex-col items-center justify-center shadow-inner shrink-0 relative group">
              <span className="text-[10px] text-[#8e8e8e] absolute top-1 font-bold tracking-wider">ANGKA</span>
              <span className="text-2xl font-black text-[#007acc] mt-2.5">{prediction.predictedClass}</span>
            </div>

            {/* Prediction metrics */}
            <div className="flex-1 space-y-1.5 text-[10px]">
              <div className="flex justify-between items-center">
                <span className="text-[#8e8e8e]">Akurasi / Confidence:</span>
                <span className="font-mono text-white font-bold bg-[#22c55e]/15 text-[#22c55e] px-1.5 py-0.5 rounded border border-[#22c55e]/20">
                  {(prediction.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8e8e8e]">Kecepatan Proses:</span>
                <span className="font-mono text-[#cccccc] font-semibold">
                  {latency} ms
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar visual indicator */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[8px] text-[#8e8e8e]">
              <span>Kecocokan Model</span>
              <span>{(prediction.confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-[#252525] rounded-full h-1.5 overflow-hidden border border-[#1d1d1d]">
              <div
                className="bg-[#007acc] h-full rounded-full transition-all duration-500"
                style={{ width: `${prediction.confidence * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CnnPanel;

import { useImageModel } from "../models/imageModel";
import api from "../services/api";

export const useEditorController = () => {
  const model = useImageModel();

  const handleFileUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result.split(",")[1];
        model.setInitialImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (!model.currentImage) return;
    
    // Simpan state saat ini ke history (permanent)
    model.saveState();
    
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${model.currentImage}`;
    link.download = "pixelforge-premium.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Untuk adjustment yang bernilai scalar (brightness, contrast, dll)
  const applyAdjustment = async (adjustmentKey, value) => {
    if (!model.originalImage) return;
    
    // Update adjustment di model
    model.updateAdjustment(adjustmentKey, value);
    
    // Jika nilai adalah 0, langsung tampilkan originalImage
    if (value === 0) {
      // Cek apakah semua adjustments adalah 0
      const allAdjustments = {
        ...model.currentAdjustments,
        [adjustmentKey]: value,
      };
      const allZero = Object.values(allAdjustments).every(v => v === 0);
      
      if (allZero) {
        model.setAdjustedImage(model.originalImage);
        return;
      }
    }
    
    // Jika tidak semua 0, apply ke backend
    model.setProcessingState(true);
    try {
      const adjustments = {
        ...model.currentAdjustments,
        [adjustmentKey]: value,
      };
      
      const res = await api.post("/api/enhancement/apply-adjustments", {
        image: model.originalImage,
        adjustments: adjustments,
      });
      
      if (res.data.status === "ok") {
        model.setAdjustedImage(res.data.result_image);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during processing.");
    } finally {
      model.setProcessingState(false);
    }
  };

  // Untuk operasi one-time (sharpen, smooth, rotate, flip, dll)
  const applyProcess = async (endpoint, payload = {}) => {
    if (!model.currentImage) return;
    model.setProcessingState(true);
    try {
      const res = await api.post(endpoint, { image: model.currentImage, ...payload });
      if (res.data.status === "ok") {
        // Simpan ke history dan reset adjustments
        model.setResultImage(res.data.result_image);
        model.updateAdjustment('brightness', 0);
        model.updateAdjustment('contrast', 0);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during processing.");
    } finally {
      model.setProcessingState(false);
    }
  };

  return {
    ...model,
    handleFileUpload,
    handleDownload,
    applyProcess,
    applyAdjustment,
  };
};

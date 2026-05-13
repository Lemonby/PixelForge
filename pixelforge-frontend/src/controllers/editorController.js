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
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${model.currentImage}`;
    link.download = "pixelforge-premium.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const applyProcess = async (endpoint, payload = {}) => {
    if (!model.currentImage) return;
    model.setProcessingState(true);
    try {
      const res = await api.post(endpoint, { image: model.currentImage, ...payload });
      if (res.data.status === "ok") {
        model.setResultImage(res.data.result_image);
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
    applyProcess
  };
};

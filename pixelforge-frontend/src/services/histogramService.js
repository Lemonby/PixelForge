import api from "./api";

export const histogramService = {
  // Get RGB histogram data
  getRGBHistogram: async (imageBase64) => {
    try {
      const response = await api.post("/api/enhancement/histogram", {
        image: imageBase64,
      });
      return response.data;
    } catch (error) {
      console.error("Error getting RGB histogram:", error);
      throw error;
    }
  },

  // Get grayscale histogram data
  getGrayscaleHistogram: async (imageBase64) => {
    try {
      const response = await api.post("/api/enhancement/histogram-gray", {
        image: imageBase64,
      });
      return response.data;
    } catch (error) {
      console.error("Error getting grayscale histogram:", error);
      throw error;
    }
  },

  // Get combined histogram data (RGB + Grayscale)
  getCombinedHistogram: async (imageBase64) => {
    try {
      const response = await api.post("/api/enhancement/histogram-combined", {
        image: imageBase64,
      });
      return response.data;
    } catch (error) {
      console.error("Error getting combined histogram:", error);
      throw error;
    }
  },

  // Get image statistics
  getImageStatistics: async (imageBase64) => {
    try {
      const response = await api.post("/api/enhancement/image-stats", {
        image: imageBase64,
      });
      return response.data;
    } catch (error) {
      console.error("Error getting image statistics:", error);
      throw error;
    }
  },
};

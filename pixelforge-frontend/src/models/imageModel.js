import { create } from "zustand";

export const useImageModel = create((set, get) => ({
  baseOriginalImage: null,
  originalImage: null,
  currentImage: null,
  isProcessing: false,
  history: [],
  historyIndex: -1,
  
  // Adjustments yang belum disimpan (temporary)
  currentAdjustments: {
    brightness: 0,
    contrast: 0,
  },
  
  setInitialImage: (base64) => set({
    baseOriginalImage: base64,
    originalImage: base64,
    currentImage: base64,
    history: [base64],
    historyIndex: 0,
    currentAdjustments: {
      brightness: 0,
      contrast: 0,
    },
  }),
  
  // Update adjustment value (brightness, contrast, dll)
  updateAdjustment: (key, value) => {
    set((state) => ({
      currentAdjustments: {
        ...state.currentAdjustments,
        [key]: value,
      },
    }));
  },
  
  // Apply current adjustments ke original image dan update currentImage
  setAdjustedImage: (base64) => {
    set({ currentImage: base64 });
  },
  
  // Simpan state ke history (ketika export/download)
  saveState: () => {
    const { currentImage, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    set({
      originalImage: currentImage,
      history: [...newHistory, currentImage],
      historyIndex: newHistory.length,
      currentAdjustments: {
        brightness: 0,
        contrast: 0,
      },
    });
  },
  
  setResultImage: (base64) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    set({
      currentImage: base64,
      history: [...newHistory, base64],
      historyIndex: newHistory.length,
    });
  },
  
  stepBack: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      set({
        historyIndex: historyIndex - 1,
        currentImage: history[historyIndex - 1],
        currentAdjustments: {
          brightness: 0,
          contrast: 0,
        },
      });
    }
  },

  stepForward: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      set({
        historyIndex: historyIndex + 1,
        currentImage: history[historyIndex + 1],
        currentAdjustments: {
          brightness: 0,
          contrast: 0,
        },
      });
    }
  },

  resetToOriginal: () => {
    const { originalImage } = get();
    if (originalImage) {
      set({
        currentImage: originalImage,
        currentAdjustments: {
          brightness: 0,
          contrast: 0,
        },
      });
    }
  },

  setProcessingState: (status) => set({ isProcessing: status }),
}));

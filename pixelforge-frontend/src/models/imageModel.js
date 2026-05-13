import { create } from "zustand";

export const useImageModel = create((set, get) => ({
  originalImage: null,
  currentImage: null,
  isProcessing: false,
  history: [],
  historyIndex: -1,
  
  setInitialImage: (base64) => set({
    originalImage: base64,
    currentImage: base64,
    history: [base64],
    historyIndex: 0,
  }),
  
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
      });
    }
  },

  stepForward: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      set({
        historyIndex: historyIndex + 1,
        currentImage: history[historyIndex + 1],
      });
    }
  },

  resetToOriginal: () => {
    const { originalImage } = get();
    if (originalImage) {
      get().setResultImage(originalImage);
    }
  },

  setProcessingState: (status) => set({ isProcessing: status }),
}));

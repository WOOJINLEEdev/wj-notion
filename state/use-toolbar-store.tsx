import { create } from "zustand";

type SelectionCoordinates = {
  top: number;
  left: number;
};
interface UseToolbarStoreProps {
  isBold: boolean;
  selectionCoordinates: SelectionCoordinates;
  bold: () => void;
  restore: () => void;
  boldToggle: () => void;
  setSelectionCoordinates: (coordinates: SelectionCoordinates) => void;
}

const useToolbarStore = create<UseToolbarStoreProps>()((set) => ({
  isBold: false,
  selectionCoordinates: {
    top: 0,
    left: 0,
  },

  bold: () => set(() => ({ isBold: true })),
  restore: () => set(() => ({ isBold: false })),
  boldToggle: () => set((state) => ({ isBold: !state.isBold })),
  setSelectionCoordinates: (coordinates) => {
    set((state) => ({
      ...state,
      selectionCoordinates: coordinates,
    }));
  },
}));

export default useToolbarStore;

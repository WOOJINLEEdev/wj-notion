import { create } from "zustand";

interface UseSnackbarStoreProps {
  isShow: boolean;
  show: () => void;
  hidden: () => void;
}

const useSnackbarStore = create<UseSnackbarStoreProps>()((set) => ({
  isShow: false,

  show: () => set(() => ({ isShow: true })),
  hidden: () => set(() => ({ isShow: false })),
}));

export default useSnackbarStore;

import { create } from "zustand";

const useAdminNavbarStore = create((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggle: () => set((state) => ({ open: !state.open })),
}));

export default useAdminNavbarStore;
import { create } from 'zustand';

export type Layout = 'grid' | 'list';

interface LayoutState {
  layout: Layout;
  setLayout: (layout: Layout) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  layout: 'grid',
  setLayout: (layout) => set({ layout }),
}));

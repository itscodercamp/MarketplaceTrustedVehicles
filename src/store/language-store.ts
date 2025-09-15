import { create } from 'zustand';

export type Language = 'English' | 'Roman Hindi' | 'Hindi' | 'Roman Marathi' | 'Marathi';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'English',
  setLanguage: (language) => set({ language }),
}));

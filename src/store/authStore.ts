import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { storage } from "./storage";

type AuthState = {
  isAuthenticated: boolean;
  employeeName: string;
  signIn: () => void;
  signOut: () => void;
};

const zustandStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.remove(name)
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      employeeName: "Flavio",
      signIn: () => set({ isAuthenticated: true }),
      signOut: () => set({ isAuthenticated: false })
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => zustandStorage)
    }
  )
);

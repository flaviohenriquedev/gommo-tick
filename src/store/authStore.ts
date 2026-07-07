import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

import {setApiAuthContext} from "@/services/api";
import {secureStorage} from "@/services/secureStorage";

import {storage} from "./storage";

type AuthSession = {
    employeeName: string;
    tenantSlug?: string;
};

type AuthState = {
    isAuthenticated: boolean;
    employeeName: string;
    tenantSlug?: string;
    signIn: (session: AuthSession) => void;
    signOut: () => Promise<void>;
};

const zustandStorage = {
    getItem: (name: string) => storage.getString(name) ?? null,
    setItem: (name: string, value: string) => storage.set(name, value),
    removeItem: (name: string) => storage.remove(name)
};

export const useAuthStore = create<AuthState>()(
    persist((set) => ({
            isAuthenticated: false,
            employeeName: "Flavio",
            tenantSlug: undefined,
            signIn: ({employeeName, tenantSlug}) =>
                set({employeeName, isAuthenticated: true, tenantSlug}),
            signOut: async () => {
                await secureStorage.clearToken();
                setApiAuthContext(null, null);
                set({isAuthenticated: false, tenantSlug: undefined});
            }
        }),
        {
            name: "auth",
            storage: createJSONStorage(() => zustandStorage),
            onRehydrateStorage: () => (state) => {
                void secureStorage.getToken().then((token) => {
                    setApiAuthContext(token, state?.tenantSlug);
                });
            }
        }
    )
);

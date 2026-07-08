import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

import {setApiAuthContext} from "@/services/api";
import {secureStorage} from "@/services/secureStorage";

import {storage} from "./storage";

type AttendanceSettings = {
    requirePhoto: boolean;
    requireLocation: boolean;
};

type AuthSession = {
    employeeName: string;
    tenantSlug?: string;
    collaboratorId?: string;
    jobPositionName?: string;
    departmentName?: string;
    attendanceSettings?: AttendanceSettings;
};

type AuthState = AuthSession & {
    isAuthenticated: boolean;
    signIn: (session: AuthSession) => void;
    setAttendanceSettings: (settings: AttendanceSettings) => void;
    signOut: () => Promise<void>;
};

const defaultAttendanceSettings: AttendanceSettings = {
    requirePhoto: true,
    requireLocation: true
};

const zustandStorage = {
    getItem: (name: string) => storage.getString(name) ?? null,
    setItem: (name: string, value: string) => storage.set(name, value),
    removeItem: (name: string) => storage.remove(name)
};

export const useAuthStore = create<AuthState>()(
    persist((set) => ({
            isAuthenticated: false,
            employeeName: "Colaborador",
            tenantSlug: undefined,
            collaboratorId: undefined,
            jobPositionName: undefined,
            departmentName: undefined,
            attendanceSettings: defaultAttendanceSettings,
            signIn: (session) =>
                set({
                    ...session,
                    attendanceSettings: session.attendanceSettings ?? defaultAttendanceSettings,
                    isAuthenticated: true
                }),
            setAttendanceSettings: (attendanceSettings) => set({attendanceSettings}),
            signOut: async () => {
                await secureStorage.clearToken();
                setApiAuthContext(null, null);
                set({
                    isAuthenticated: false,
                    tenantSlug: undefined,
                    collaboratorId: undefined,
                    jobPositionName: undefined,
                    departmentName: undefined,
                    attendanceSettings: defaultAttendanceSettings
                });
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

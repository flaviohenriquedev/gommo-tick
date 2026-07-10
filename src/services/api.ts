import Constants from "expo-constants";
import { create, type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { secureStorage } from "@/services/secureStorage";

const DEV_API_PORT = 8081;
const PRODUCTION_API_URL = "https://api.gommo.tick.local";
export const TENANT_HEADER = "X-Tenant-Slug";

type ExpoRuntimeConfig = {
    debuggerHost?: string;
    hostUri?: string;
};

type PersistedAuthState = {
    state?: {
        tenantSlug?: string;
    };
};

declare module "axios" {
    export interface AxiosRequestConfig {
        skipAuthRetry?: boolean;
        skipAuth?: boolean;
        _retry?: boolean;
    }
}

function extractHostName(hostUri: string) {
    const authority = hostUri
        .replace(/^https?:\/\//, "")
        .replace(/^exps?:\/\//, "")
        .split("/")[0];
    const hostName = authority.split(":")[0];

    return hostName || undefined;
}

function getExpoHostName() {
    const expoConfig = Constants.expoConfig as ExpoRuntimeConfig | null;
    const manifest = Constants.manifest as ExpoRuntimeConfig | null;
    const hostUri = expoConfig?.hostUri ?? manifest?.debuggerHost;

    return hostUri ? extractHostName(hostUri) : undefined;
}

function getDefaultApiUrl() {
    if (process.env.NODE_ENV === "production") {
        return PRODUCTION_API_URL;
    }

    return `http://${getExpoHostName() ?? "localhost"}:${DEV_API_PORT}`;
}

function readPersistedTenantSlug() {
    if (typeof localStorage === "undefined") return undefined;

    try {
        const rawAuth = localStorage.getItem("auth");
        if (!rawAuth) return undefined;

        const parsedAuth = JSON.parse(rawAuth) as PersistedAuthState;
        return parsedAuth.state?.tenantSlug;
    } catch {
        return undefined;
    }
}

function hasHeader(config: InternalAxiosRequestConfig, headerName: string) {
    return Boolean(config.headers.get?.(headerName) ?? config.headers[headerName]);
}

function isAuthEndpoint(url?: string) {
    return Boolean(url?.includes("/api/v1/auth/"));
}

export const api = create({
    baseURL: process.env.EXPO_PUBLIC_API_URL ?? getDefaultApiUrl(),
    timeout: 12000
});

api.interceptors.request.use(async (config) => {
    if (!config.skipAuth && !hasHeader(config, "Authorization")) {
        const token = await secureStorage.getToken();
        if (token) {
            config.headers.set("Authorization", `Bearer ${token}`);
        }
    }

    if (!hasHeader(config, TENANT_HEADER)) {
        const tenantSlug = readPersistedTenantSlug();
        if (tenantSlug) {
            config.headers.set(TENANT_HEADER, tenantSlug);
        }
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const config = error.config;
        const status = error.response?.status;

        if (
            !config ||
            config.skipAuthRetry ||
            config._retry ||
            config.skipAuth ||
            isAuthEndpoint(config.url) ||
            (status !== 401 && status !== 403)
        ) {
            return Promise.reject(error);
        }

        config._retry = true;

        const { refreshSession } = await import("@/features/auth/services/auth.service");
        const accessToken = await refreshSession();

        if (!accessToken) {
            const { useAuthStore } = await import("@/store/authStore");
            await useAuthStore.getState().signOut();
            return Promise.reject(error);
        }

        config.headers.set("Authorization", `Bearer ${accessToken}`);
        return api.request(config);
    }
);

export function setApiAuthContext(accessToken?: string | null, tenantSlug?: string | null) {
    if (accessToken) {
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
        delete api.defaults.headers.common.Authorization;
    }

    if (tenantSlug) {
        api.defaults.headers.common[TENANT_HEADER] = tenantSlug;
    } else {
        delete api.defaults.headers.common[TENANT_HEADER];
    }
}

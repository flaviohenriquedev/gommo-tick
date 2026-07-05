import Constants from "expo-constants";
import { create } from "axios";

const DEV_API_PORT = 8081;
const PRODUCTION_API_URL = "https://api.gommo.tick.local";
const TENANT_HEADER = "X-Tenant-Slug";

type ExpoRuntimeConfig = {
    debuggerHost?: string;
    hostUri?: string;
};

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

export const api = create({
    baseURL: process.env.EXPO_PUBLIC_API_URL ?? getDefaultApiUrl(),
    timeout: 12000
});

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

import * as SecureStore from "expo-secure-store";

const accessTokenKey = "gommo_tick_access_token";
const refreshTokenKey = "gommo_tick_refresh_token";

async function isSecureStoreAvailable() {
    try {
        return await SecureStore.isAvailableAsync();
    } catch {
        return false;
    }
}

function getWebStorage() {
    return typeof localStorage === "undefined" ? null : localStorage;
}

async function getItem(key: string) {
    if (await isSecureStoreAvailable()) {
        return SecureStore.getItemAsync(key);
    }
    return getWebStorage()?.getItem(key) ?? null;
}

async function setItem(key: string, value: string) {
    if (await isSecureStoreAvailable()) {
        await SecureStore.setItemAsync(key, value);
        return;
    }
    getWebStorage()?.setItem(key, value);
}

async function deleteItem(key: string) {
    if (await isSecureStoreAvailable()) {
        await SecureStore.deleteItemAsync(key);
        return;
    }
    getWebStorage()?.removeItem(key);
}

export const secureStorage = {
    getToken: () => getItem(accessTokenKey),
    getRefreshToken: () => getItem(refreshTokenKey),
    setToken: (token: string) => setItem(accessTokenKey, token),
    setRefreshToken: (token: string) => setItem(refreshTokenKey, token),
    clearToken: async () => {
        await deleteItem(accessTokenKey);
        await deleteItem(refreshTokenKey);
    }
};

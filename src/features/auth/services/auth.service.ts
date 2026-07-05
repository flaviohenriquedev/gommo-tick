import { api, setApiAuthContext } from "@/services/api";
import { secureStorage } from "@/services/secureStorage";

export type LoginRequestDto = {
    username: string;
    password: string;
    companyCode: string;
};

export type LoginResponseDto = {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresInSeconds: number;
    username: string;
    email?: string;
    tenantSlug?: string;
    photoObjectId?: string;
    permissions: string[];
    platformAdmin: boolean;
};

export async function login(payload: LoginRequestDto) {
    const response = await api.post<LoginResponseDto>("/api/v1/auth/login", payload);
    const data = response.data;

    await secureStorage.setToken(data.accessToken);
    await secureStorage.setRefreshToken(data.refreshToken);
    setApiAuthContext(data.accessToken, data.tenantSlug);

    return data;
}

export async function logout() {
    await secureStorage.clearToken();
    setApiAuthContext(null, null);
}

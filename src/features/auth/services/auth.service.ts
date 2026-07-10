import { api, setApiAuthContext, TENANT_HEADER } from "@/services/api";
import { secureStorage } from "@/services/secureStorage";
import { useAuthStore } from "@/store/authStore";

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
    name: string;
    username: string;
    email?: string;
    tenantSlug?: string;
    photoObjectId?: string;
    collaboratorId?: string;
    jobPositionId?: string;
    jobPositionName?: string;
    departmentId?: string;
    departmentName?: string;
    permissions: string[];
    platformAdmin: boolean;
};

type RefreshResponseDto = Pick<
    LoginResponseDto,
    | "accessToken"
    | "refreshToken"
    | "tokenType"
    | "expiresInSeconds"
    | "tenantSlug"
    | "collaboratorId"
    | "photoObjectId"
    | "jobPositionId"
    | "jobPositionName"
    | "departmentId"
    | "departmentName"
    | "permissions"
>;

let refreshInFlight: Promise<string | null> | null = null;

async function persistSessionTokens(
    data: Pick<LoginResponseDto, "accessToken" | "refreshToken" | "tenantSlug">,
    fallbackTenantSlug?: string | null
) {
    const tenantSlug = data.tenantSlug ?? fallbackTenantSlug ?? undefined;
    await secureStorage.setToken(data.accessToken);
    await secureStorage.setRefreshToken(data.refreshToken);
    setApiAuthContext(data.accessToken, tenantSlug ?? null);
    return data.accessToken;
}

export async function login(payload: LoginRequestDto) {
    const { companyCode, ...credentials } = payload;
    const response = await api.post<LoginResponseDto>("/api/v1/auth/login", credentials, {
        headers: {
            [TENANT_HEADER]: companyCode.trim()
        },
        skipAuthRetry: true
    });
    const data = response.data;

    await persistSessionTokens(data, data.tenantSlug);

    return data;
}

export async function refreshSession(): Promise<string | null> {
    if (refreshInFlight) {
        return refreshInFlight;
    }

    refreshInFlight = (async () => {
        const refreshToken = await secureStorage.getRefreshToken();
        if (!refreshToken) {
            return null;
        }

        const tenantSlug = useAuthStore.getState().tenantSlug;
        try {
            const response = await api.post<RefreshResponseDto>(
                "/api/v1/auth/refresh",
                { refreshToken },
                {
                    headers: tenantSlug ? { [TENANT_HEADER]: tenantSlug } : undefined,
                    skipAuthRetry: true,
                    skipAuth: true
                }
            );
            return persistSessionTokens(response.data, tenantSlug);
        } catch {
            return null;
        }
    })().finally(() => {
        refreshInFlight = null;
    });

    return refreshInFlight;
}

export async function logout() {
    await secureStorage.clearToken();
    setApiAuthContext(null, null);
}

import { isAxiosError } from "axios";

type ApiErrorPayload = {
    detail?: string;
    error?: string;
    message?: string;
    title?: string;
};

export function getApiErrorMessage(error: unknown, fallback: string) {
    if (!isAxiosError<ApiErrorPayload>(error)) {
        return error instanceof Error ? error.message : fallback;
    }

    const status = error.response?.status;
    const url = error.config?.url ?? "";
    const data = error.response?.data;

    if (status === 403 && url.includes("/api/v1/storage/upload")) {
        return "Sua sessão não autorizou o envio da selfie. Entre novamente; se continuar, confira o acesso mobile no backend.";
    }

    return data?.message ?? data?.detail ?? data?.error ?? data?.title ?? fallback;
}

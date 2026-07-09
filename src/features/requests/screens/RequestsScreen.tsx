import { useMemo } from "react";
import { ActivityIndicator, View } from "react-native";
import { Clock3, FilePenLine, Plus } from "lucide-react-native";

import { Card } from "@/components/system/card/Card";
import { Header } from "@/components/system/header/Header";
import { Screen } from "@/components/system/screen/Screen";
import { StatusPill } from "@/components/system/status-pill/StatusPill";
import { AppText } from "@/components/system/typography/AppText";
import { useTickRequests } from "@/features/requests/hooks/useSubmitTickRequest";
import type { TickRequestResponseDto, TickRequestStatus, TickRequestType } from "@/features/requests/types/tickRequest.types";
import { colors } from "@/theme/colors";

type StatusMeta = {
    label: string;
    tone: "success" | "warning" | "error" | "neutral";
};

const requestTypeLabel: Record<TickRequestType, string> = {
    TIME_ADJUSTMENT: "Ajuste de ponto",
    DAY_ABSENCE_EXCUSE: "Abono de dia",
    MEDICAL_CERTIFICATE: "Atestado médico",
    LEAVE_ABSENCE: "Afastamento",
    HOUR_BANK: "Banco de horas",
    OTHER: "Outro"
};

const statusMeta: Record<TickRequestStatus, StatusMeta> = {
    PENDING: { label: "Pendente", tone: "warning" },
    APPROVED: { label: "Aprovado", tone: "success" },
    REJECTED: { label: "Rejeitado", tone: "error" },
    RETURNED: { label: "Devolvido", tone: "neutral" }
};

function toIsoDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + days);
    return nextDate;
}

function toDisplayDate(isoDate?: string) {
    if (!isoDate) return "--/--/----";
    const [year, month, day] = isoDate.split("-");
    if (!year || !month || !day) return isoDate;
    return `${day}/${month}/${year}`;
}

function formatTime(value?: string) {
    return value ? value.slice(0, 5) : undefined;
}

function requestStatus(request: TickRequestResponseDto) {
    return request.requestStatus ?? request.status ?? "PENDING";
}

function requestDate(request: TickRequestResponseDto) {
    return request.workDate ?? request.requestDate;
}

function requestKindLabel(request: TickRequestResponseDto) {
    if (request.requestType !== "TIME_ADJUSTMENT") return "Solicitação geral";
    return request.referenceId ?? request.targetRecordId ? "Correção de batida" : "Ponto manual";
}

function requestSummary(request: TickRequestResponseDto) {
    const entries = [
        ["Entrada", request.clockIn],
        ["Saída almoço", request.breakStart],
        ["Retorno almoço", request.breakEnd],
        ["Fim expediente", request.clockOut],
        ["Ponto manual", request.manualPunchTime]
    ]
        .map(([label, value]) => [label, formatTime(value as string | undefined)] as const)
        .filter(([, value]) => Boolean(value));

    if (!entries.length) return "Nenhum horário informado.";

    return entries.map(([label, value]) => `${label}: ${value}`).join(" • ");
}

function requestDetails(request: TickRequestResponseDto) {
    return request.notes ?? request.details ?? "Sem justificativa informada.";
}

function RequestCard({ request }: { request: TickRequestResponseDto }) {
    const status = requestStatus(request);
    const meta = statusMeta[status] ?? statusMeta.PENDING;
    const Icon = request.referenceId ?? request.targetRecordId ? FilePenLine : Plus;

    return (
        <Card className="gap-3" key={request.id}>
            <View className="flex-row items-start justify-between gap-3">
                <View className="min-w-0 flex-1 flex-row gap-3">
                    <View className="h-10 w-10 items-center justify-center rounded-[20px] bg-primarySoft">
                        <Icon color={colors.primary} size={20} />
                    </View>
                    <View className="min-w-0 flex-1">
                        <AppText className="font-inter-extrabold">
                            {requestKindLabel(request)}
                        </AppText>
                        <AppText variant="label">
                            {requestTypeLabel[request.requestType] ?? request.requestType}
                        </AppText>
                    </View>
                </View>
                <StatusPill label={meta.label} tone={meta.tone} />
            </View>

            <View className="rounded-[16px] bg-[#faf8ff] p-3">
                <AppText className="font-inter-semibold text-xs" color={colors.muted}>
                    Enviado para {toDisplayDate(requestDate(request))}
                </AppText>
                <AppText className="mt-1 font-inter-extrabold">
                    {requestSummary(request)}
                </AppText>
            </View>

            <View className="gap-1">
                <AppText variant="label">Justificativa</AppText>
                <AppText className="font-inter-semibold text-sm leading-5">
                    {requestDetails(request)}
                </AppText>
            </View>

            {request.reviewReason ? (
                <View className="gap-1 rounded-[14px] bg-[#fff1cc] p-3">
                    <AppText className="font-inter-extrabold text-xs" color="#aa7100">
                        Retorno do RH
                    </AppText>
                    <AppText className="font-inter-semibold text-sm" color="#6f4d00">
                        {request.reviewReason}
                    </AppText>
                </View>
            ) : null}
        </Card>
    );
}

export function RequestsScreen() {
    const today = useMemo(() => new Date(), []);
    const fromIso = useMemo(() => toIsoDate(addDays(today, -89)), [today]);
    const toIso = useMemo(() => toIsoDate(today), [today]);
    const requestsQuery = useTickRequests(fromIso, toIso);
    const requests = requestsQuery.data ?? [];

    return (
        <Screen backgroundColor={colors.surface}>
            <Header title="Solicitações" />

            <View className="gap-1">
                <AppText className="font-inter-extrabold text-lg">
                    Minhas solicitações
                </AppText>
                <AppText variant="label">
                    Acompanhe correções de ponto e pontos manuais enviados ao RH.
                </AppText>
            </View>

            <View className="mt-5 gap-4">
                {requestsQuery.isLoading ? (
                    <Card className="items-center gap-3 py-8">
                        <ActivityIndicator color={colors.primary} />
                        <AppText variant="label">Carregando solicitações...</AppText>
                    </Card>
                ) : requests.length ? (
                    requests.map((request) => <RequestCard key={request.id} request={request} />)
                ) : (
                    <Card className="items-center gap-3 py-8">
                        <View className="h-12 w-12 items-center justify-center rounded-[24px] bg-primarySoft">
                            <Clock3 color={colors.primary} size={24} />
                        </View>
                        <AppText className="font-inter-extrabold">
                            Nenhuma solicitação enviada
                        </AppText>
                        <AppText center variant="label">
                            Correções e pontos manuais enviados aparecerão aqui com o status da análise.
                        </AppText>
                    </Card>
                )}
            </View>
        </Screen>
    );
}

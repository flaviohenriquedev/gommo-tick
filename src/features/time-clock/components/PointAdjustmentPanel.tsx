import {useMemo, useState} from "react";
import {isAxiosError} from "axios";
import {Pressable, ScrollView, View} from "react-native";
import {useQueryClient} from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import {CalendarDays, Clock3, FilePenLine, Plus, RefreshCcw, Utensils} from "lucide-react-native";

import {Card} from "@/components/system/card/Card";
import {AppModal} from "@/components/system/modal/AppModal";
import {AppText} from "@/components/system/typography/AppText";
import {Button} from "@/components/ui/action/button/Button";
import {
    AppDateInput,
    AppFileInput,
    AppInput,
    AppSelect,
    AppTextarea,
    AppTimeInput,
    type AppFileInputValue
} from "@/components/ui/data-input/input";
import {useSubmitTickRequest} from "@/features/requests/hooks/useSubmitTickRequest";
import type {TickRequestSubmissionDto} from "@/features/requests/types/tickRequest.types";
import {attendanceKeys, useAttendanceRecords} from "@/features/time-clock/hooks/useAttendance";
import type {AttendanceRecordDto} from "@/features/time-clock/types/attendance.types";
import {colors} from "@/theme/colors";

type ApiErrorPayload = {
    detail?: string;
    error?: string;
    message?: string;
    status?: number;
    title?: string;
};

type PeriodMode = "today" | "week";
type PunchSlotKey = "clockIn" | "breakStart" | "breakEnd" | "clockOut";

type PunchSlot = {
    emptyLabel: string;
    icon: typeof Clock3;
    key: PunchSlotKey;
    title: string;
};

type EditDraft = {
    record: AttendanceRecordDto;
    slot: PunchSlot;
};

const punchSlots: PunchSlot[] = [
    {emptyLabel: "Sem entrada", icon: Clock3, key: "clockIn", title: "Entrada"},
    {emptyLabel: "Sem saída", icon: Utensils, key: "breakStart", title: "Saída almoço"},
    {emptyLabel: "Sem retorno", icon: RefreshCcw, key: "breakEnd", title: "Retorno almoço"},
    {emptyLabel: "Sem saída", icon: Clock3, key: "clockOut", title: "Fim expediente"}
];

const reasonOptions = [
    {label: "Esquecimento de registro", value: "Esquecimento de registro"},
    {label: "Erro no horário registrado", value: "Erro no horário registrado"},
    {label: "Sem conexão no momento", value: "Sem conexão no momento"},
    {label: "Registro em equipamento incorreto", value: "Registro em equipamento incorreto"},
    {label: "Orientação do gestor", value: "Orientação do gestor"},
    {label: "Outro", value: "Outro"}
];

function createClientRequestId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

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

function toDisplayDate(isoDate: string) {
    const [year, month, day] = isoDate.split("-");
    if (!year || !month || !day) return isoDate;
    return `${day}/${month}/${year}`;
}

function formatTime(value?: string) {
    if (!value) return "";
    return value.slice(0, 5);
}

function stringifyErrorData(data: unknown) {
    if (!data) return undefined;
    if (typeof data === "string") return data;

    try {
        return JSON.stringify(data);
    } catch {
        return String(data);
    }
}

function getApiErrorMessage(error: unknown) {
    if (isAxiosError<ApiErrorPayload>(error)) {
        const status = error.response?.status;
        const data = error.response?.data;
        const backendMessage = data?.message ?? data?.detail ?? data?.error ?? data?.title;
        const serializedData = stringifyErrorData(data);

        if (backendMessage && status) return `${backendMessage} (HTTP ${status})`;
        if (backendMessage) return backendMessage;
        if (serializedData && status) return `${serializedData} (HTTP ${status})`;
        if (serializedData) return serializedData;
        if (status) return `Falha na comunicação com o servidor (HTTP ${status}).`;
        if (error.message) return error.message;
    }

    if (error instanceof Error && error.message) return error.message;

    return "Não foi possível enviar a solicitação. Tente novamente.";
}

function logTickRequestError(error: unknown) {
    if (isAxiosError<ApiErrorPayload>(error)) {
        console.error("[TickRequest] Submission failed", {
            baseURL: error.config?.baseURL,
            data: stringifyErrorData(error.response?.data),
            method: error.config?.method,
            message: error.message,
            status: error.response?.status,
            url: error.config?.url
        });
        return;
    }

    console.error("[TickRequest] Submission failed", error);
}

function buildDetails(reason: string, note: string, action: string) {
    const details = [`Ação: ${action}`, `Motivo: ${reason}`];
    const trimmedNote = note.trim();

    if (trimmedNote) {
        details.push(`Observação: ${trimmedNote}`);
    }

    return details.join("\n");
}

function buildAttachmentPayload(attachment: AppFileInputValue | null, attachmentType: string) {
    if (!attachment) return {};

    return {
        attachmentFile: {
            uri: attachment.uri,
            fileName: attachment.name,
            mimeType: attachment.mimeType,
            file: attachment.file
        },
        attachmentDocumentType: attachmentType.trim() || "Documento"
    };
}

function recordTime(record: AttendanceRecordDto, slotKey: PunchSlotKey) {
    return formatTime(record[slotKey]);
}

function sortRecords(records: AttendanceRecordDto[]) {
    return [...records].sort((left, right) => right.workDate.localeCompare(left.workDate));
}

export function PointAdjustmentPanel() {
    const queryClient = useQueryClient();
    const submitTickRequest = useSubmitTickRequest();
    const today = useMemo(() => new Date(), []);
    const todayIso = useMemo(() => toIsoDate(today), [today]);
    const [periodMode, setPeriodMode] = useState<PeriodMode>("today");
    const fromIso = periodMode === "today" ? todayIso : toIsoDate(addDays(today, -6));
    const toIso = todayIso;
    const attendanceRecords = useAttendanceRecords(fromIso, toIso);
    const records = useMemo(
        () => sortRecords(attendanceRecords.data ?? []),
        [attendanceRecords.data]
    );
    const [editDraft, setEditDraft] = useState<EditDraft | null>(null);
    const [isManualModalVisible, setManualModalVisible] = useState(false);
    const [requestTime, setRequestTime] = useState("");
    const [manualDate, setManualDate] = useState(today);
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");
    const [attachment, setAttachment] = useState<AppFileInputValue | null>(null);
    const [attachmentType, setAttachmentType] = useState("");
    const [submissionError, setSubmissionError] = useState("");

    const resetForm = () => {
        setRequestTime("");
        setManualDate(today);
        setReason("");
        setDetails("");
        setAttachment(null);
        setAttachmentType("");
        setSubmissionError("");
    };

    const closeEditModal = () => {
        setEditDraft(null);
        resetForm();
    };

    const closeManualModal = () => {
        setManualModalVisible(false);
        resetForm();
    };

    const openEditModal = (record: AttendanceRecordDto, slot: PunchSlot) => {
        Haptics.selectionAsync();
        setEditDraft({record, slot});
        setRequestTime(recordTime(record, slot.key));
        setReason("");
        setDetails("");
        setAttachment(null);
        setAttachmentType("");
        setSubmissionError("");
    };

    const openManualModal = () => {
        resetForm();
        setManualModalVisible(true);
    };

    const invalidateAttendance = async () => {
        await queryClient.invalidateQueries({queryKey: attendanceKeys.all});
    };

    const submitPayload = (payload: TickRequestSubmissionDto, onSuccess: () => void) => {
        setSubmissionError("");
        submitTickRequest.mutate(payload, {
            onSuccess: async () => {
                await invalidateAttendance();
                onSuccess();
            },
            onError: (error) => {
                logTickRequestError(error);
                setSubmissionError(getApiErrorMessage(error));
            }
        });
    };

    const sendEditRequest = () => {
        if (!editDraft || !requestTime.trim() || !reason) return;

        submitPayload(
            {
                requestType: "TIME_ADJUSTMENT",
                requestDate: editDraft.record.workDate,
                targetRecordId: editDraft.record.id,
                [editDraft.slot.key]: requestTime.trim(),
                details: buildDetails(reason, details, `Alteração de ${editDraft.slot.title}`),
                ...buildAttachmentPayload(attachment, attachmentType),
                source: "MOBILE",
                clientRequestId: createClientRequestId(),
                submittedAt: new Date().toISOString()
            },
            closeEditModal
        );
    };

    const sendManualRequest = () => {
        if (!requestTime.trim() || !reason) return;

        submitPayload(
            {
                requestType: "TIME_ADJUSTMENT",
                requestDate: toIsoDate(manualDate),
                manualPunchTime: requestTime.trim(),
                details: buildDetails(reason, details, "Novo ponto manual"),
                ...buildAttachmentPayload(attachment, attachmentType),
                source: "MOBILE",
                clientRequestId: createClientRequestId(),
                submittedAt: new Date().toISOString()
            },
            closeManualModal
        );
    };

    const renderPunchCard = (record: AttendanceRecordDto, slot: PunchSlot) => {
        const Icon = slot.icon;
        const time = recordTime(record, slot.key);

        return (
            <View className="w-[48%]" key={slot.key}>
                <Pressable
                    accessibilityRole="button"
                    className="min-h-[100px] rounded-[18px] border border-border bg-[#faf8ff] p-3"
                    onPress={() => openEditModal(record, slot)}
                >
                    <View className="flex-row items-center gap-2 ">
                        <View className="h-8 w-8 items-center justify-center rounded-[16px] bg-primarySoft">
                            <Icon color={colors.primary} size={17}/>
                        </View>
                        <AppText
                            center
                            className="font-inter-semibold text-[11px]"
                        >
                            {slot.title}
                        </AppText>
                    </View>

                    <AppText
                        className="mt-1 font-inter-extrabold text-[20px] leading-7"
                        color={time ? colors.text : colors.muted}
                    >
                        {time || "--:--"}
                    </AppText>
                    <AppText variant="label">{time ? "Registrado" : slot.emptyLabel}</AppText>
                </Pressable>
            </View>
        );
    };

    const renderRecordCard = (record: AttendanceRecordDto) => (
        <Card className="gap-4" key={record.id}>
            <View className="flex-row items-center justify-between gap-3">
                <View>
                    <AppText className="font-inter-extrabold">Registros do dia</AppText>
                    <AppText variant="label">{toDisplayDate(record.workDate)}</AppText>
                </View>
                <View className="h-10 w-10 items-center justify-center rounded-[20px] bg-primarySoft">
                    <CalendarDays color={colors.primary} size={20}/>
                </View>
            </View>
            <View className="flex-row flex-wrap justify-between gap-y-3">
                {punchSlots.map((slot) => renderPunchCard(record, slot))}
            </View>
        </Card>
    );

    const renderRequestFields = (isManual: boolean) => (
        <ScrollView
            className="max-h-[620px]"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            <View className="gap-4 pb-1">
                <View className="flex-row items-center gap-3">
                    <View className="h-11 w-11 items-center justify-center rounded-button bg-primarySoft">
                        {isManual ? (
                            <Plus color={colors.primary} size={22}/>
                        ) : (
                            <FilePenLine color={colors.primary} size={22}/>
                        )}
                    </View>
                    <View className="min-w-0 flex-1">
                        <AppText className="font-inter-extrabold">
                            {isManual ? "Novo ponto manual" : `Alterar ${editDraft?.slot.title}`}
                        </AppText>
                        <AppText variant="label">
                            {isManual
                                ? "Informe o horário esquecido para o RH analisar."
                                : "Envie o horário correto para aprovação do RH."}
                        </AppText>
                    </View>
                </View>

                {isManual ? (
                    <AppDateInput
                        label="Data do ponto"
                        onChange={setManualDate}
                        placeholder="Selecione a data"
                        value={manualDate}
                    />
                ) : null}

                <AppTimeInput
                    label="Horário"
                    onChangeText={setRequestTime}
                    placeholder="08:00"
                    value={requestTime}
                />

                <AppSelect
                    label="Motivo da alteração"
                    onChange={setReason}
                    options={reasonOptions}
                    placeholder="Selecionar motivo"
                    value={reason}
                />

                <AppTextarea
                    label="Observação"
                    onChangeText={setDetails}
                    placeholder="Inclua detalhes que ajudem na análise."
                    value={details}
                />

                <AppInput
                    label="Tipo de documento"
                    onChangeText={setAttachmentType}
                    placeholder="Ex.: Declaração, atestado, comprovante"
                    value={attachmentType}
                />

                <AppFileInput
                    label="Anexo"
                    onChange={setAttachment}
                    placeholder="Selecionar documento"
                    value={attachment}
                />

                {submissionError ? (
                    <AppText className="font-inter-semibold text-xs" color={colors.error}>
                        {submissionError}
                    </AppText>
                ) : null}

                <Button
                    disabled={!requestTime.trim() || !reason || submitTickRequest.isPending}
                    label={submitTickRequest.isPending ? "Enviando..." : "Enviar solicitação"}
                    onPress={isManual ? sendManualRequest : sendEditRequest}
                />
                <Button
                    label="Cancelar"
                    onPress={isManual ? closeManualModal : closeEditModal}
                    variant="secondary"
                />
            </View>
        </ScrollView>
    );

    return (
        <>

            <View className="mt-4 flex-row gap-3">
                <Pressable
                    accessibilityRole="button"
                    className="flex-1 items-center rounded-button border px-3 py-3"
                    onPress={() => setPeriodMode("today")}
                    style={{
                        backgroundColor:
                            periodMode === "today" ? colors.primarySoft : colors.surface,
                        borderColor: periodMode === "today" ? colors.primary : colors.border
                    }}
                >
                    <AppText
                        className="font-inter-extrabold text-xs"
                        color={periodMode === "today" ? colors.primary : colors.muted}
                    >
                        Hoje
                    </AppText>
                </Pressable>
                <Pressable
                    accessibilityRole="button"
                    className="flex-1 items-center rounded-button border px-3 py-3"
                    onPress={() => setPeriodMode("week")}
                    style={{
                        backgroundColor:
                            periodMode === "week" ? colors.primarySoft : colors.surface,
                        borderColor: periodMode === "week" ? colors.primary : colors.border
                    }}
                >
                    <AppText
                        className="font-inter-extrabold text-xs"
                        color={periodMode === "week" ? colors.primary : colors.muted}
                    >
                        Últimos 7 dias
                    </AppText>
                </Pressable>
            </View>

            <View className="mt-5 gap-4">
                {attendanceRecords.isLoading ? (
                    <Card>
                        <AppText variant="label">Carregando registros...</AppText>
                    </Card>
                ) : records.length ? (
                    records.map(renderRecordCard)
                ) : (
                    <Card className="items-center gap-3 py-8">
                        <View className="h-12 w-12 items-center justify-center rounded-[24px] bg-primarySoft">
                            <Clock3 color={colors.primary} size={24}/>
                        </View>
                        <AppText className="font-inter-extrabold">
                            Nenhum registro encontrado
                        </AppText>
                        <AppText center variant="label">
                            Solicite um ponto manual se você esqueceu de registrar uma batida.
                        </AppText>
                    </Card>
                )}
            </View>

            <Button className="mt-8" label="Novo ponto manual" onPress={openManualModal}/>

            <AppModal onClose={closeEditModal} visible={Boolean(editDraft)}>
                {renderRequestFields(false)}
            </AppModal>

            <AppModal onClose={closeManualModal} visible={isManualModalVisible}>
                {renderRequestFields(true)}
            </AppModal>
        </>
    );
}

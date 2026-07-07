import {useState} from "react";
import {isAxiosError} from "axios";
import {Pressable, View} from "react-native";
import * as Haptics from "expo-haptics";
import {
    CalendarClock,
    Clock3,
    FilePenLine,
    MessageSquareText,
    Pencil,
    Plus
} from "lucide-react-native";

import {Card} from "@/components/system/card/Card";
import {FormScreen} from "@/components/system/form-screen/FormScreen";
import {Header} from "@/components/system/header/Header";
import {AppModal} from "@/components/system/modal/AppModal";
import {Screen} from "@/components/system/screen/Screen";
import {StatusPill} from "@/components/system/status-pill/StatusPill";
import {AppText} from "@/components/system/typography/AppText";
import {Button} from "@/components/ui/action/button/Button";
import {
    AppDateInput,
    AppFileInput,
    AppInput,
    AppTextarea,
    AppTimeInput,
    type AppFileInputValue
} from "@/components/ui/data-input/input";
import {requests} from "@/data/mock";
import {useSubmitTickRequest} from "@/features/requests/hooks/useSubmitTickRequest";
import type {
    TickRequestSubmissionDto,
    TickRequestType
} from "@/features/requests/types/tickRequest.types";
import {colors} from "@/theme/colors";

const requestToneColor = {
    success: colors.success,
    warning: colors.warning,
    error: colors.error
} as const;

type RequestsScreenProps = {
    primaryTabLabel?: string;
    title?: string;
};

type RequestTypeId = "time-adjustment" | "hour-bank" | "other";

type RequestType = {
    description: string;
    detailsLabel: string;
    detailsPlaceholder: string;
    icon: typeof Clock3;
    id: RequestTypeId;
    title: string;
};

type ApiErrorPayload = {
    detail?: string;
    error?: string;
    message?: string;
    status?: number;
    title?: string;
};

const requestTypes: RequestType[] = [
    {
        description: "Corrigir entrada, saída ou intervalo.",
        detailsLabel: "O que precisa ser ajustado?",
        detailsPlaceholder: "Ex.: esqueci de registrar a saída às 17:00.",
        icon: Clock3,
        id: "time-adjustment",
        title: "Ajuste de ponto"
    },
    {
        description: "Solicitar compensação ou conferência.",
        detailsLabel: "Qual ajuste deseja solicitar?",
        detailsPlaceholder: "Ex.: compensar 2 horas no dia 10/07.",
        icon: CalendarClock,
        id: "hour-bank",
        title: "Banco de horas"
    },
    {
        description: "Enviar uma solicitação manual.",
        detailsLabel: "Descreva sua solicitação",
        detailsPlaceholder: "Inclua as informações necessárias para o RH analisar.",
        icon: FilePenLine,
        id: "other",
        title: "Outro pedido"
    }
];

const requestPayloadType: Record<RequestTypeId, TickRequestType> = {
    "time-adjustment": "TIME_ADJUSTMENT",
    "hour-bank": "HOUR_BANK",
    other: "OTHER"
};

function createClientRequestId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeRequestDate(value: string) {
    const trimmedValue = value.trim();
    const dateMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmedValue);

    if (!dateMatch) return trimmedValue;

    const [, day, month, year] = dateMatch;
    return `${year}-${month}-${day}`;
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

function buildTickRequestPayload({
                                     attachment,
                                     attachmentType,
                                     clockOut,
                                     requestDate,
                                     requestDetails,
                                     requestTypeId
                                 }: {
    attachment: AppFileInputValue | null;
    attachmentType: string;
    clockOut: string;
    requestDate: string;
    requestDetails: string;
    requestTypeId: RequestTypeId;
}): TickRequestSubmissionDto {
    const trimmedAttachmentType = attachmentType.trim();
    const normalizedClockOut = clockOut.trim();

    return {
        requestType: requestPayloadType[requestTypeId],
        requestDate: normalizeRequestDate(requestDate),
        ...(normalizedClockOut ? {clockOut: normalizedClockOut} : {}),
        details: requestDetails.trim(),
        ...(attachment
            ? {
                attachmentFile: {
                    uri: attachment.uri,
                    fileName: attachment.name,
                    mimeType: attachment.mimeType,
                    file: attachment.file
                },
                attachmentDocumentType: trimmedAttachmentType
            }
            : {}),
        source: "MOBILE",
        clientRequestId: createClientRequestId(),
        submittedAt: new Date().toISOString()
    };
}

export function RequestsScreen({
                                   primaryTabLabel = "Minhas Solicitações",
                                   title = "Solicitações"
                               }: RequestsScreenProps) {
    const submitTickRequest = useSubmitTickRequest();
    const [isRequestModalVisible, setRequestModalVisible] = useState(false);
    const [selectedRequestTypeId, setSelectedRequestTypeId] = useState<RequestTypeId | null>(null);
    const [isRequestFormVisible, setRequestFormVisible] = useState(false);
    const [requestDate, setRequestDate] = useState("");
    const [clockOut, setClockOut] = useState("");
    const [requestDetails, setRequestDetails] = useState("");
    const [attachment, setAttachment] = useState<AppFileInputValue | null>(null);
    const [attachmentType, setAttachmentType] = useState("");
    const [submissionError, setSubmissionError] = useState("");
    const selectedRequestType = requestTypes.find(
        (requestType) => requestType.id === selectedRequestTypeId
    );

    const resetRequestDraft = () => {
        setSelectedRequestTypeId(null);
        setRequestDate("");
        setClockOut("");
        setRequestDetails("");
        setAttachment(null);
        setAttachmentType("");
        setSubmissionError("");
    };

    const openRequestModal = () => {
        resetRequestDraft();
        setRequestModalVisible(true);
    };

    const openRequestTypeEditor = () => {
        setRequestModalVisible(true);
    };

    const selectRequestType = (requestTypeId: RequestTypeId) => {
        Haptics.selectionAsync();
        setSelectedRequestTypeId(requestTypeId);
    };

    const continueToRequestForm = () => {
        if (!selectedRequestTypeId) return;

        setRequestModalVisible(false);
        setRequestFormVisible(true);
    };

    const closeRequestForm = () => {
        setRequestFormVisible(false);
        resetRequestDraft();
    };

    const sendRequest = () => {
        const isClockOutRequired = selectedRequestTypeId === "time-adjustment";

        if (
            !selectedRequestTypeId ||
            !requestDate ||
            !requestDetails.trim() ||
            (isClockOutRequired && !clockOut.trim())
        ) {
            return;
        }

        setSubmissionError("");
        submitTickRequest.mutate(
            buildTickRequestPayload({
                attachment,
                attachmentType,
                clockOut,
                requestDate,
                requestDetails,
                requestTypeId: selectedRequestTypeId
            }),
            {
                onSuccess: closeRequestForm,
                onError: (error) => {
                    logTickRequestError(error);
                    setSubmissionError(getApiErrorMessage(error));
                }
            }
        );
    };

    const renderRequestTypeModal = () => (
        <AppModal onClose={() => setRequestModalVisible(false)} visible={isRequestModalVisible}>
            <View className="gap-3 p-4">
                {requestTypes.map((requestType) => {
                    const Icon = requestType.icon;
                    const isSelected = selectedRequestTypeId === requestType.id;

                    return (
                        <Pressable
                            accessibilityRole="button"
                            className="min-h-[72px] w-full flex-row items-center gap-3 rounded-[18px] border p-3"
                            key={requestType.id}
                            onPress={() => selectRequestType(requestType.id)}
                            style={{
                                backgroundColor: isSelected ? colors.primarySoft : "#faf8ff",
                                borderColor: isSelected ? colors.primary : colors.border
                            }}
                        >
                            <View className="h-9 w-9 items-center justify-center rounded-[18px] bg-primarySoft">
                                <Icon color={colors.primary} size={20}/>
                            </View>
                            <View>
                                <AppText className="font-inter-extrabold" color={colors.text}>
                                    {requestType.title}
                                </AppText>
                                <AppText
                                    className="mt-1 font-inter-semibold text-xs leading-4"
                                    color={colors.muted}
                                >
                                    {requestType.description}
                                </AppText>
                            </View>
                        </Pressable>
                    );
                })}
                <Button
                    disabled={!selectedRequestTypeId}
                    label="Continuar"
                    onPress={continueToRequestForm}
                />
            </View>
        </AppModal>
    );

    if (isRequestFormVisible && selectedRequestType) {
        const SelectedRequestIcon = selectedRequestType.icon;
        const isClockOutVisible = selectedRequestTypeId === "time-adjustment";
        const isClockOutRequired = selectedRequestTypeId === "time-adjustment";
        const isSubmitDisabled =
            !requestDate ||
            !requestDetails.trim() ||
            (isClockOutRequired && !clockOut.trim()) ||
            submitTickRequest.isPending;

        return (
            <>
                <FormScreen
                    actionDisabled={isSubmitDisabled}
                    actionLabel={submitTickRequest.isPending ? "Enviando..." : "Enviar solicitação"}
                    onAction={sendRequest}
                    onBack={closeRequestForm}
                    title="Nova Solicitação"
                >
                    <Pressable
                        accessibilityRole="button"
                        className="w-full"
                        onPress={openRequestTypeEditor}
                        style={({pressed}) =>
                            pressed ? {opacity: 0.72, transform: [{scale: 0.99}]} : null
                        }
                    >
                        <Card className="w-full flex-row items-center gap-3 p-4">
                            <View className="h-11 w-11 items-center justify-center rounded-button bg-primarySoft">
                                <SelectedRequestIcon color={colors.primary} size={22}/>
                            </View>
                            <View className="min-w-0 flex-1 gap-1">
                                <AppText className="font-inter-extrabold">
                                    {selectedRequestType.title}
                                </AppText>
                                <AppText variant="label">{selectedRequestType.description}</AppText>
                            </View>
                            <View className="h-8 w-8 items-center justify-center rounded-2xl bg-primarySoft">
                                <Pencil color={colors.primary} size={18}/>
                            </View>
                        </Card>
                    </Pressable>

                    <AppDateInput
                        label="Data da solicitação"
                        onChange={setRequestDate}
                        placeholder="Selecione a data"
                        value={requestDate}
                    />

                    {isClockOutVisible ? (
                        <AppTimeInput
                            label="Horário de saída"
                            onChangeText={setClockOut}
                            placeholder="17:00"
                            value={clockOut}
                        />
                    ) : null}

                    <AppTextarea
                        label={selectedRequestType.detailsLabel}
                        onChangeText={setRequestDetails}
                        placeholder={selectedRequestType.detailsPlaceholder}
                        value={requestDetails}
                    />

                    <AppInput
                        label="Tipo de arquivo"
                        onChangeText={setAttachmentType}
                        placeholder="Ex.: Atestado, declaração, comprovante"
                        value={attachmentType}
                    />

                    <AppFileInput
                        label="Anexo"
                        onChange={setAttachment}
                        placeholder="Selecionar arquivo"
                        value={attachment}
                    />

                    {submissionError ? (
                        <AppText className="font-inter-semibold text-xs" color={colors.error}>
                            {submissionError}
                        </AppText>
                    ) : null}

                    <Card className="flex-row items-center gap-3 bg-[#faf8ff] p-4">
                        <View className="h-9 w-9 items-center justify-center rounded-[18px] bg-primarySoft">
                            <MessageSquareText color={colors.primary} size={20}/>
                        </View>
                        <View className="min-w-0 flex-1 gap-1">
                            <AppText className="font-inter-extrabold">Análise do RH</AppText>
                            <AppText variant="label">
                                Sua solicitação será enviada para conferência e acompanhamento no
                                histórico.
                            </AppText>
                        </View>
                    </Card>
                </FormScreen>
                {renderRequestTypeModal()}
            </>
        );
    }

    return (
        <Screen backgroundColor={colors.surface}>
            <Header title={title}/>
            <View className="flex-row border-b border-[#eeeaf5]">
                <View className="flex-1 items-center border-b-2 border-primary py-3">
                    <AppText className="font-inter-extrabold" color={colors.primary}>
                        {primaryTabLabel}
                    </AppText>
                </View>
                <View className="flex-1 items-center py-3">
                    <AppText variant="label">Histórico</AppText>
                </View>
            </View>

            <Card className="mt-5 py-1">
                {requests.map((request) => (
                    <View
                        className="flex-row items-center justify-between border-b border-[#f2eff7] py-4"
                        key={`${request.title}-${request.date}`}
                    >
                        <View className="flex-row items-center gap-3">
                            <View
                                className="h-3 w-3 rounded-md"
                                style={{backgroundColor: requestToneColor[request.tone]}}
                            />
                            <View>
                                <AppText className="font-inter-extrabold">{request.title}</AppText>
                                <AppText variant="label">{request.date}</AppText>
                            </View>
                        </View>
                        <StatusPill label={request.status} tone={request.tone}/>
                    </View>
                ))}
            </Card>

            <Button className="mt-8" label="Nova Solicitação" onPress={openRequestModal}/>
            <View
                className="left-6 top-[-36px] h-0 w-6 items-center justify-center"
                style={{pointerEvents: "none"}}
            >
                <Plus color={colors.surface} size={18}/>
            </View>

            {renderRequestTypeModal()}
        </Screen>
    );
}

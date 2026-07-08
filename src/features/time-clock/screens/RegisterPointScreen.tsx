import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Camera } from "lucide-react-native";

import { Card } from "@/components/system/card/Card";
import { Header } from "@/components/system/header/Header";
import { Screen } from "@/components/system/screen/Screen";
import { AppText } from "@/components/system/typography/AppText";
import { Button } from "@/components/ui/action/button/Button";
import { LocationPreviewMap } from "@/features/time-clock/components/LocationPreviewMap";
import {
    useAttendanceContext,
    useClockAttendance
} from "@/features/time-clock/hooks/useAttendance";
import { attendanceService } from "@/features/time-clock/services/attendance.service";
import {
    createClientRequestId,
    formatClock,
    formatDateLabel,
    formatTime,
    nextPunchIndex,
    nextPunchLabel
} from "@/features/time-clock/utils/attendanceCalculations";
import { getApiErrorMessage } from "@/services/apiError";
import { useAuthStore } from "@/store/authStore";
import { colors } from "@/theme/colors";

type BrowserPosition = {
    coords: {
        latitude: number;
        longitude: number;
        accuracy?: number;
    };
};

type LocationSnapshot = {
    accuracy?: number;
    address?: string;
    latitude: number;
    longitude: number;
};

type ReverseGeocodeResponse = {
    display_name?: string;
};

function getBrowserLocation() {
    return new Promise<BrowserPosition>((resolve, reject) => {
        if (typeof navigator === "undefined" || !navigator.geolocation) {
            reject(new Error("Geolocalização indisponível neste dispositivo."));
            return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 12000,
            maximumAge: 30000
        });
    });
}

function locationErrorMessage(error: unknown) {
    if (
        typeof GeolocationPositionError !== "undefined" &&
        error instanceof GeolocationPositionError &&
        error.code === error.PERMISSION_DENIED
    ) {
        return "Permita o acesso à localização para registrar o ponto.";
    }

    return error instanceof Error ? error.message : "Não foi possível obter sua localização.";
}

async function reverseGeocode(latitude: number, longitude: number) {
    const params = new URLSearchParams({
        format: "jsonv2",
        lat: String(latitude),
        lon: String(longitude),
        zoom: "18",
        addressdetails: "1"
    });
    const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
        {
            headers: {
                Accept: "application/json",
                "Accept-Language": "pt-BR"
            }
        }
    );

    if (!response.ok) return undefined;

    const data = (await response.json()) as ReverseGeocodeResponse;
    return data.display_name;
}

export function RegisterPointScreen() {
    const cameraRef = useRef<CameraView | null>(null);
    const attendanceSettings = useAuthStore((state) => state.attendanceSettings);
    const setAttendanceSettings = useAuthStore((state) => state.setAttendanceSettings);
    const contextQuery = useAttendanceContext();
    const clockMutation = useClockAttendance();
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [now, setNow] = useState(new Date());
    const [error, setError] = useState("");
    const [submissionStep, setSubmissionStep] = useState("");
    const [location, setLocation] = useState<LocationSnapshot | null>(null);
    const [locationError, setLocationError] = useState("");
    const [isLocating, setIsLocating] = useState(false);
    const [hasRequestedLocation, setHasRequestedLocation] = useState(false);

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        if (contextQuery.data) {
            setAttendanceSettings({
                requirePhoto: contextQuery.data.requirePhoto,
                requireLocation: contextQuery.data.requireLocation
            });
        }
    }, [contextQuery.data, setAttendanceSettings]);

    const todayRecord = contextQuery.data?.todayRecord;
    const settings = contextQuery.data ??
        attendanceSettings ?? { requirePhoto: true, requireLocation: true };
    const currentPunchIndex = nextPunchIndex(todayRecord);
    const isComplete = currentPunchIndex >= 4;
    const lastLabel = useMemo(() => {
        if (!todayRecord?.clockIn) return "Nenhum registro";
        if (todayRecord.clockOut) return "Saída";
        if (todayRecord.breakEnd) return "Volta do almoço";
        if (todayRecord.breakStart) return "Saída para almoço";
        return "Entrada";
    }, [todayRecord]);
    const lastTime =
        todayRecord?.clockOut ??
        todayRecord?.breakEnd ??
        todayRecord?.breakStart ??
        todayRecord?.clockIn;
    const isSubmitting = clockMutation.isPending || Boolean(submissionStep);

    const requestLocation = useCallback(async () => {
        if (!settings.requireLocation) {
            setLocation(null);
            setLocationError("");
            return null;
        }

        setHasRequestedLocation(true);
        setIsLocating(true);
        setLocationError("");
        try {
            const position = await getBrowserLocation();
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const nextLocation = {
                latitude,
                longitude,
                accuracy: position.coords.accuracy,
                address: await reverseGeocode(latitude, longitude)
            };
            setLocation(nextLocation);
            return nextLocation;
        } catch (caught) {
            const message = locationErrorMessage(caught);
            setLocation(null);
            setLocationError(message);
            return null;
        } finally {
            setIsLocating(false);
        }
    }, [settings.requireLocation]);

    useEffect(() => {
        if (!settings.requireLocation || isComplete || hasRequestedLocation || isLocating) return;

        const timeoutId = setTimeout(() => {
            void requestLocation();
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [hasRequestedLocation, isComplete, isLocating, requestLocation, settings.requireLocation]);

    const ensureCameraPermission = async () => {
        if (!settings.requirePhoto) return true;
        if (cameraPermission?.granted) return true;
        const result = await requestCameraPermission();
        return result.granted;
    };

    const handleClock = async () => {
        setError("");
        setSubmissionStep("");
        try {
            if (isComplete || isSubmitting) return;
            setSubmissionStep("Validando permissões...");
            const hasCameraPermission = await ensureCameraPermission();
            if (!hasCameraPermission) {
                setError("Permita o acesso à câmera para registrar o ponto.");
                return;
            }

            let currentLocation = location;
            if (settings.requireLocation && !currentLocation) {
                setSubmissionStep("Preparando localização...");
                currentLocation = await requestLocation();
                if (!currentLocation) {
                    setError("A localização precisa estar pronta antes do registro.");
                    return;
                }
            }

            let photoObjectId: string | undefined;
            if (settings.requirePhoto) {
                setSubmissionStep("Capturando selfie...");
                const photo = await cameraRef.current?.takePictureAsync({ quality: 0.72 });
                if (!photo?.uri) {
                    setError("Não foi possível capturar a selfie.");
                    return;
                }
                setSubmissionStep("Enviando selfie...");
                photoObjectId = await attendanceService.uploadPhoto({
                    uri: photo.uri,
                    fileName: `ponto-${Date.now()}.jpg`,
                    mimeType: "image/jpeg"
                });
            }

            setSubmissionStep("Registrando ponto...");
            await clockMutation.mutateAsync({
                capturedAt: new Date().toISOString(),
                clientRequestId: createClientRequestId(),
                latitude: currentLocation?.latitude,
                longitude: currentLocation?.longitude,
                locationAccuracyMeters: currentLocation?.accuracy,
                ...(photoObjectId
                    ? {
                          photo: {
                              objectId: photoObjectId,
                              fileName: "selfie-ponto.jpg",
                              documentType: "CLOCK_SELFIE"
                          }
                      }
                    : {})
            });
        } catch (caught) {
            setError(getApiErrorMessage(caught, "Não foi possível registrar o ponto."));
        } finally {
            setSubmissionStep("");
        }
    };

    return (
        <Screen backgroundColor={colors.surface}>
            <Header title="Registrar Ponto" />
            <AppText center variant="clock">
                {formatClock(now)}
            </AppText>
            <AppText center variant="subtitle">
                {formatDateLabel(now)}
            </AppText>
            <AppText center className="mt-2 font-inter-extrabold text-success">
                {isComplete ? "Jornada concluída" : nextPunchLabel(todayRecord)}
            </AppText>

            <View className="mt-8 h-40 w-40 items-center justify-center self-center overflow-hidden rounded-[80px] border-[3px] border-[#8b5cf6] bg-[#faf7ff]">
                {settings.requirePhoto && cameraPermission?.granted ? (
                    <CameraView
                        ref={cameraRef}
                        facing="front"
                        style={{ height: 160, width: 160 }}
                    />
                ) : (
                    <Camera color={colors.primary} size={48} strokeWidth={1.8} />
                )}
            </View>
            <AppText center className="mt-5 font-inter-extrabold text-lg text-primary">
                {settings.requirePhoto ? "Selfie obrigatória" : "Foto dispensada"}
            </AppText>

            {settings.requireLocation ? (
                <LocationPreviewMap
                    accuracy={location?.accuracy}
                    address={location?.address}
                    error={locationError}
                    isLoading={isLocating}
                    latitude={location?.latitude}
                    longitude={location?.longitude}
                    onRefresh={() => void requestLocation()}
                />
            ) : null}

            <Card className="mt-5 flex-row items-end justify-between">
                <View>
                    <AppText color={colors.text} variant="label">
                        Último registro
                    </AppText>
                    <AppText color={colors.success} variant="label">
                        {lastLabel}
                    </AppText>
                    <AppText className="font-inter-extrabold text-[23px] leading-7">
                        {formatTime(lastTime)}
                    </AppText>
                </View>
                {contextQuery.isFetching ? (
                    <ActivityIndicator color={colors.primary} />
                ) : (
                    <AppText variant="subtitle">Hoje</AppText>
                )}
            </Card>

            {error ? (
                <AppText className="mt-3 font-inter-semibold text-xs" color={colors.error}>
                    {error}
                </AppText>
            ) : null}

            <Button
                className="mt-4"
                disabled={isSubmitting || contextQuery.isLoading || isComplete || isLocating}
                label={
                    isSubmitting
                        ? submissionStep || "Aguarde..."
                        : isComplete
                          ? "Jornada concluída"
                          : `Registrar ${nextPunchLabel(todayRecord)}`
                }
                loading={isSubmitting || isLocating}
                onPress={handleClock}
            />
        </Screen>
    );
}

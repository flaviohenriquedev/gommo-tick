import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";
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

type DevicePosition = {
    coords: {
        latitude: number;
        longitude: number;
        accuracy?: number | null;
    };
};

type LocationSnapshot = {
    accuracy?: number;
    address?: string;
    latitude: number;
    longitude: number;
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

function formatNativeAddress(address: Location.LocationGeocodedAddress) {
    if (address.formattedAddress?.trim()) {
        return address.formattedAddress.trim();
    }

    const streetLine = [address.street, address.streetNumber].filter(Boolean).join(", ");
    return [
        address.name,
        streetLine,
        address.district,
        address.city,
        address.region,
        address.postalCode
    ]
        .filter((part, index, parts) => Boolean(part) && parts.indexOf(part) === index)
        .join(" - ");
}

async function getNativeAddress(latitude: number, longitude: number) {
    if (Platform.OS === "web") return undefined;

    const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
    const formattedAddress = addresses[0] ? formatNativeAddress(addresses[0]) : "";
    return formattedAddress || undefined;
}

async function safeGetNativeAddress(latitude: number, longitude: number) {
    try {
        return await getNativeAddress(latitude, longitude);
    } catch {
        return undefined;
    }
}

async function getDeviceLocation(): Promise<DevicePosition> {
    if (Platform.OS === "web") {
        return getBrowserLocation();
    }

    const currentPermission = await Location.getForegroundPermissionsAsync();
    const permission = currentPermission.granted
        ? currentPermission
        : await Location.requestForegroundPermissionsAsync();

    if (!permission.granted) {
        throw new Error("Permita o acesso à localização para registrar o ponto.");
    }

    const lastKnownPosition = await Location.getLastKnownPositionAsync({
        maxAge: 60000,
        requiredAccuracy: 150
    });

    return (
        lastKnownPosition ??
        Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High
        })
    );
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
    const didRunInitialCameraPermissionFlow = useRef(false);
    const isRequestingLocation = useRef(false);
    const locationRef = useRef<LocationSnapshot | null>(null);

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
            locationRef.current = null;
            setLocation(null);
            setLocationError("");
            return null;
        }

        if (isRequestingLocation.current) return locationRef.current;

        isRequestingLocation.current = true;
        setIsLocating(true);
        setLocationError("");
        try {
            const position = await getDeviceLocation();
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const nextLocation = {
                latitude,
                longitude,
                accuracy: position.coords.accuracy ?? undefined
            };

            locationRef.current = nextLocation;
            setLocation(nextLocation);

            const address = await safeGetNativeAddress(latitude, longitude);
            if (address) {
                const locatedAddress = { ...nextLocation, address };
                locationRef.current = locatedAddress;
                setLocation((currentLocation) =>
                    currentLocation?.latitude === latitude && currentLocation.longitude === longitude
                        ? locatedAddress
                        : currentLocation
                );
                return locatedAddress;
            }

            return nextLocation;
        } catch (caught) {
            const message = locationErrorMessage(caught);
            locationRef.current = null;
            setLocation(null);
            setLocationError(message);
            return null;
        } finally {
            isRequestingLocation.current = false;
            setIsLocating(false);
        }
    }, [settings.requireLocation]);

    useEffect(() => {
        if (isComplete || didRunInitialCameraPermissionFlow.current || !settings.requirePhoto) return;
        if (cameraPermission?.granted || cameraPermission?.canAskAgain === false) return;

        didRunInitialCameraPermissionFlow.current = true;
        void requestCameraPermission();
    }, [
        cameraPermission?.canAskAgain,
        cameraPermission?.granted,
        isComplete,
        requestCameraPermission,
        settings.requirePhoto
    ]);

    useFocusEffect(
        useCallback(() => {
            if (isComplete || !settings.requireLocation) return undefined;

            void requestLocation();

            return undefined;
        }, [isComplete, requestLocation, settings.requireLocation])
    );

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

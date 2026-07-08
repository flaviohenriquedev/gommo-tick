import { createElement } from "react";
import { ActivityIndicator, Linking, Platform, Pressable, View } from "react-native";
import { ExternalLink, MapPin, RefreshCcw } from "lucide-react-native";

import { Card } from "@/components/system/card/Card";
import { AppText } from "@/components/system/typography/AppText";
import { colors } from "@/theme/colors";

type LocationPreviewMapProps = {
    accuracy?: number;
    address?: string;
    error?: string;
    isLoading?: boolean;
    latitude?: number;
    longitude?: number;
    onRefresh: () => void;
};

function osmUrl(latitude: number, longitude: number) {
    return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`;
}

function osmEmbedUrl(latitude: number, longitude: number) {
    const delta = 0.003;
    const left = longitude - delta;
    const right = longitude + delta;
    const bottom = latitude - delta;
    const top = latitude + delta;

    return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${latitude}%2C${longitude}`;
}

function formatCoordinate(value: number) {
    return value.toFixed(6);
}

export function LocationPreviewMap({
    accuracy,
    address,
    error,
    isLoading = false,
    latitude,
    longitude,
    onRefresh
}: LocationPreviewMapProps) {
    const hasLocation = latitude != null && longitude != null;
    const mapUrl = hasLocation ? osmUrl(latitude, longitude) : undefined;

    return (
        <Card className="mt-5 gap-3 p-4">
            <View className="flex-row items-center justify-between gap-3">
                <View className="min-w-0 flex-1">
                    <AppText className="font-inter-extrabold">Localização</AppText>
                    <AppText variant="label">
                        {hasLocation
                            ? address ||
                              (accuracy
                                  ? `Precisão aproximada: ${Math.round(accuracy)} m`
                                  : "Localização pronta para envio")
                            : "Preparando localização para o registro"}
                    </AppText>
                </View>
                <Pressable
                    accessibilityRole="button"
                    className="h-10 w-10 items-center justify-center rounded-[20px] bg-primarySoft"
                    disabled={isLoading}
                    onPress={onRefresh}
                >
                    {isLoading ? (
                        <ActivityIndicator color={colors.primary} size="small" />
                    ) : (
                        <RefreshCcw color={colors.primary} size={18} />
                    )}
                </Pressable>
            </View>

            <View className="h-32 overflow-hidden rounded-[18px] border border-border bg-[#eef0f4]">
                {hasLocation && Platform.OS === "web" ? (
                    <View className="relative h-full w-full">
                        {createElement("iframe", {
                            src: osmEmbedUrl(latitude, longitude),
                            title: "Mapa da sua localização",
                            style: {
                                border: 0,
                                filter: "saturate(0.78) contrast(1.04)",
                                height: "100%",
                                width: "100%"
                            }
                        })}
                        <View
                            className="absolute inset-0 bg-[rgba(243,237,255,0.08)]"
                            pointerEvents="none"
                        />
                        <View
                            className="absolute bottom-2 left-2 rounded-[12px] bg-surface/95 px-3 py-2"
                            pointerEvents="none"
                        >
                            <AppText
                                className="font-inter-extrabold text-[11px]"
                                color={colors.primary}
                            >
                                OpenStreetMap
                            </AppText>
                        </View>
                    </View>
                ) : (
                    <View className="h-full items-center justify-center gap-2 px-4">
                        <MapPin color={hasLocation ? colors.primary : colors.muted} size={28} />
                        <AppText center variant="label">
                            {hasLocation
                                ? "Mapa disponível no navegador. No app nativo, abra a localização externa."
                                : isLoading
                                  ? "Obtendo sua localização..."
                                  : "Autorize a localização para anexar ao ponto."}
                        </AppText>
                    </View>
                )}
            </View>

            {hasLocation ? (
                <View className="flex-row items-center justify-between gap-3">
                    <View className="min-w-0 flex-1">
                        <AppText variant="label">
                            {formatCoordinate(latitude)}, {formatCoordinate(longitude)}
                        </AppText>
                    </View>
                    {mapUrl ? (
                        <Pressable
                            accessibilityRole="link"
                            className="flex-row items-center gap-1 rounded-[16px] bg-primarySoft px-3 py-2"
                            onPress={() => Linking.openURL(mapUrl)}
                        >
                            <ExternalLink color={colors.primary} size={14} />
                            <AppText
                                className="font-inter-extrabold text-xs"
                                color={colors.primary}
                            >
                                Abrir
                            </AppText>
                        </Pressable>
                    ) : null}
                </View>
            ) : null}

            {error ? (
                <AppText className="font-inter-semibold text-xs" color={colors.error}>
                    {error}
                </AppText>
            ) : null}
        </Card>
    );
}

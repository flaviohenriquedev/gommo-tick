import { ActivityIndicator, Linking, Pressable, View } from "react-native";
import { ExternalLink, LocateFixed, RefreshCcw } from "lucide-react-native";

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

function mapUrl(latitude: number, longitude: number) {
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
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
    const externalMapUrl = hasLocation ? mapUrl(latitude, longitude) : undefined;

    return (
        <Card className="mt-4 gap-2 p-3">
            <View className="flex-row items-center justify-between gap-3">
                <View className="min-w-0 flex-1">
                    <AppText className="font-inter-extrabold">Localização</AppText>
                    <AppText numberOfLines={1} variant="label">
                        {hasLocation ? "Endereço pronto para envio" : "Preparando localização"}
                    </AppText>
                </View>
                <Pressable
                    accessibilityLabel="Atualizar localização"
                    accessibilityRole="button"
                    className="h-9 w-9 items-center justify-center rounded-[18px] bg-primarySoft"
                    disabled={isLoading}
                    onPress={onRefresh}
                >
                    {isLoading ? (
                        <ActivityIndicator color={colors.primary} size="small" />
                    ) : (
                        <RefreshCcw color={colors.primary} size={17} />
                    )}
                </Pressable>
            </View>

            <View className="rounded-[16px] border border-border bg-primarySoft/45 p-3">
                {hasLocation ? (
                    <View className="gap-2">
                        <View className="flex-row items-center gap-2">
                            <LocateFixed color={colors.primary} size={18} />
                            <AppText className="font-inter-extrabold text-primary">
                                Endereço capturado
                            </AppText>
                        </View>
                        <AppText className="font-inter-semibold text-sm leading-5" numberOfLines={2}>
                            {address || "Endereço não encontrado. A localização será enviada com o registro."}
                        </AppText>
                        <AppText className="font-inter-semibold text-xs" color={colors.muted}>
                            Precisão: {accuracy ? `${Math.round(accuracy)} m` : "não informada"}
                        </AppText>
                    </View>
                ) : (
                    <View className="items-center justify-center gap-2 py-2">
                        {isLoading ? (
                            <ActivityIndicator color={colors.primary} />
                        ) : (
                            <LocateFixed color={colors.muted} size={26} />
                        )}
                        <AppText center variant="label">
                            {isLoading ? "Obtendo sua localização..." : "Autorize a localização para registrar o ponto."}
                        </AppText>
                    </View>
                )}
            </View>

            {hasLocation && externalMapUrl ? (
                <View className="flex-row items-center justify-between gap-3">
                    <AppText className="min-w-0 flex-1" numberOfLines={1} variant="label">
                        Enviada junto com o registro.
                    </AppText>
                    <Pressable
                        accessibilityRole="link"
                        className="flex-row items-center gap-1 rounded-[14px] bg-primarySoft px-3 py-1.5"
                        onPress={() => Linking.openURL(externalMapUrl)}
                    >
                        <ExternalLink color={colors.primary} size={13} />
                        <AppText className="font-inter-extrabold text-xs" color={colors.primary}>
                            Abrir
                        </AppText>
                    </Pressable>
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

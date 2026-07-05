import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

import { colors } from "@/theme/colors";

import { AppText } from "../typography/AppText";

type HeaderProps = {
    canGoBack?: boolean;
    title: string;
};

export function Header({ canGoBack = true, title }: HeaderProps) {
    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
            return;
        }

        router.replace("/(tabs)");
    };

    return (
        <View className="mb-3 h-8 items-center justify-center">
            {canGoBack ? (
                <Pressable
                    accessibilityRole="button"
                    className="absolute left-0 h-8 w-8 items-center justify-center"
                    onPress={handleBack}
                >
                    <ChevronLeft color={colors.text} size={26} strokeWidth={2.2} />
                </Pressable>
            ) : null}
            <AppText center color={colors.text} variant="subtitle">
                {title}
            </AppText>
        </View>
    );
}

import {Pressable, View} from "react-native";
import {ChevronRight} from "lucide-react-native";

import {Card} from "@/components/system/card/Card";
import {Header} from "@/components/system/header/Header";
import {Screen} from "@/components/system/screen/Screen";
import {AppText} from "@/components/system/typography/AppText";
import {settingsItems} from "@/data/mock";
import {colors} from "@/theme/colors";

export function MoreScreen() {
    return (
        <Screen backgroundColor={colors.surface}>
            <Header title="Mais"/>
            <AppText className="mb-2 mt-5" variant="label">
                OPÇÕES
            </AppText>
            <Card className="py-2">
                {settingsItems.map(({label, value, icon: Icon}) => (
                    <Pressable
                        className="flex-row items-center justify-between border-b border-[#f2eff7] py-4"
                        key={label}
                        style={({pressed}) => (pressed ? {opacity: 0.68, transform: [{scale: 0.99}]} : null)}
                    >
                        <View className="flex-row items-center gap-3">
                            <Icon color={colors.primary} size={20}/>
                            <AppText>{label}</AppText>
                        </View>
                        <View className="flex-row items-center gap-1">
                            {value ? <AppText variant="label">{value}</AppText> : null}
                            <ChevronRight color={colors.muted} size={18}/>
                        </View>
                    </Pressable>
                ))}
            </Card>

            <AppText className="mb-2 mt-5" variant="label">
                SOBRE
            </AppText>
            <Card className="flex-row items-center justify-between">
                <AppText>Versão do App</AppText>
                <AppText variant="label">1.0.0</AppText>
            </Card>
        </Screen>
    );
}
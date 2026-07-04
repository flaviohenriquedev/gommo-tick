import { View } from "react-native";
import { BellRing } from "lucide-react-native";

import { Card } from "@/components/system/card/Card";
import { Header } from "@/components/system/header/Header";
import { Screen } from "@/components/system/screen/Screen";
import { AppText } from "@/components/system/typography/AppText";
import { notifications } from "@/data/mock";
import { colors } from "@/theme/colors";

const dotColor = {
  success: colors.success,
  warning: colors.warning,
  info: colors.info,
  neutral: colors.muted
} as const;

export function NotificationsScreen() {
  const unreadCount = notifications.length;

  return (
    <Screen backgroundColor={colors.surface}>
      <Header title="Notificações" />

      <Card className="flex-row items-center gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-[22px] bg-primarySoft">
          <BellRing color={colors.primary} size={24} />
        </View>
        <View className="flex-1 gap-1">
          <AppText className="font-inter-extrabold">{unreadCount} novas atualizações</AppText>
          <AppText variant="label">Acompanhe avisos importantes sobre sua jornada.</AppText>
        </View>
      </Card>

      <AppText className="mb-2 mt-5" variant="label">
        RECENTES
      </AppText>

      <Card className="py-1">
        {notifications.map((item) => (
          <View className="flex-row gap-3 border-b border-[#f2eff7] py-4" key={`${item.title}-${item.time}`}>
            <View className="mt-1 h-3 w-3 rounded-md" style={{ backgroundColor: dotColor[item.tone] }} />
            <View className="flex-1 gap-1">
              <View className="flex-row items-center justify-between">
                <AppText className="flex-1 pr-3 font-inter-extrabold">{item.title}</AppText>
                <AppText variant="label">{item.time}</AppText>
              </View>
              <AppText variant="label">{item.description}</AppText>
            </View>
          </View>
        ))}
      </Card>
    </Screen>
  );
}
import { View } from "react-native";

import { Card } from "@/components/system/card/Card";
import { Header } from "@/components/system/header/Header";
import { Screen } from "@/components/system/screen/Screen";
import { AppText } from "@/components/system/typography/AppText";
import { hourBalanceEntries } from "@/data/mock";
import { colors } from "@/theme/colors";

const toneColor = {
  success: colors.success,
  error: colors.error,
  neutral: colors.text
} as const;

export function HourBalanceScreen() {
  return (
    <Screen backgroundColor={colors.surface}>
      <Header title="Extrato de Horas" />
      <View className="items-center rounded-card bg-[#faf9fd] p-5">
        <AppText variant="label">Saldo Atual</AppText>
        <AppText className="font-inter-extrabold text-[32px] leading-10">+08h30</AppText>
        <AppText className="font-inter-extrabold">Banco de Horas</AppText>
      </View>

      <View className="mt-5 flex-row border-b border-[#eeeaf5]">
        <View className="flex-1 items-center border-b-2 border-primary py-3">
          <AppText className="font-inter-extrabold" color={colors.primary}>
            Histórico
          </AppText>
        </View>
        <View className="flex-1 items-center py-3">
          <AppText variant="label">Resumos</AppText>
        </View>
      </View>

      <Card className="mt-4 py-1">
        {hourBalanceEntries.map((entry) => (
          <View className="flex-row items-center justify-between border-b border-[#f2eff7] py-4" key={`${entry.title}-${entry.date}`}>
            <View>
              <AppText className="font-inter-extrabold">{entry.title}</AppText>
              <AppText variant="label">{entry.date}</AppText>
            </View>
            <AppText className="font-inter-extrabold" color={toneColor[entry.tone]}>
              {entry.value}
            </AppText>
          </View>
        ))}
      </Card>
    </Screen>
  );
}
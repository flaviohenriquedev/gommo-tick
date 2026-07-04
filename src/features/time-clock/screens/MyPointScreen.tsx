import { View } from "react-native";

import { Card } from "@/components/system/card/Card";
import { Header } from "@/components/system/header/Header";
import { MetricCard } from "@/components/system/metric-card/MetricCard";
import { Screen } from "@/components/system/screen/Screen";
import { AppText } from "@/components/system/typography/AppText";
import { AppDateInput } from "@/components/ui/data-input/input";
import { timeEntries } from "@/data/mock";
import { colors } from "@/theme/colors";

const dotColor = {
  success: colors.success,
  warning: "#f4be2a",
  info: colors.info,
  neutral: "#9ca3af"
} as const;

export function MyPointScreen() {
  return (
    <Screen backgroundColor={colors.surface}>
      <Header title="Meu Ponto" />
      <AppDateInput value="02/07/2026" />

      <View className="mt-5 flex-row gap-3">
        <MetricCard label="Horas trabalhadas" value="08h00" />
        <MetricCard label="Meta do dia" value="08h00" />
      </View>

      <Card className="mt-5 gap-0 py-2">
        {timeEntries.map((entry) => (
          <View className="flex-row items-center gap-3 border-b border-[#f4f1f8] py-4" key={entry.label}>
            <View className="h-3 w-3 rounded-md" style={{ backgroundColor: dotColor[entry.tone] }} />
            <AppText className="flex-1">{entry.label}</AppText>
            <AppText className="font-inter-extrabold">{entry.time}</AppText>
          </View>
        ))}
        <View className="flex-row items-center gap-3 border-b border-[#f4f1f8] py-4">
          <View />
          <AppText className="flex-1">Total do dia</AppText>
          <AppText className="font-inter-extrabold">08h00</AppText>
        </View>
      </Card>

      <View className="mt-5 flex-row items-center gap-3 rounded-button bg-[#f6f7f6] p-4">
        <AppText className="font-inter-extrabold text-[26px]" color={colors.success}>
          ?
        </AppText>
        <AppText variant="subtitle">Faltam 00h00 para atingir sua meta diária</AppText>
      </View>
    </Screen>
  );
}
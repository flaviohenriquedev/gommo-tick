import { View } from "react-native";

import { Button } from "@/components/ui/action/button/Button";
import { Card } from "@/components/system/card/Card";
import { Header } from "@/components/system/header/Header";
import { MetricCard } from "@/components/system/metric-card/MetricCard";
import { Screen } from "@/components/system/screen/Screen";
import { AppText } from "@/components/system/typography/AppText";
import { AppDateRangeInput } from "@/components/ui/data-input/input";
import { mirrorDays } from "@/data/mock";
import { colors } from "@/theme/colors";

export function MirrorScreen() {
  return (
    <Screen backgroundColor={colors.surface}>
      <Header title="Espelho de Ponto" />
      <AppDateRangeInput value={{start: new Date(2026, 5, 1), end: new Date(2026, 5, 30)}} />

      <View className="mt-5 flex-row gap-3">
        <MetricCard label="Total no período" value="176h00" />
        <MetricCard accent={colors.success} label="Banco de horas" value="+08h30" />
      </View>

      <Card className="mt-3 gap-3">
        {mirrorDays.map((day) => (
          <View className="flex-row items-center gap-3" key={day.day}>
            <AppText className="w-20" color={colors.text} variant="label">
              {day.day}
            </AppText>
            <View className="h-[9px] flex-1 overflow-hidden rounded-button bg-[#f0edf5]">
              <View
                className="h-full rounded-button"
                style={{
                  backgroundColor: day.tone === "warning" ? "#f4be2a" : "#4cc26f",
                  width: `${day.progress}%`
                }}
              />
            </View>
            <AppText className="w-14 font-inter-extrabold">{day.hours}</AppText>
          </View>
        ))}
      </Card>

      <Button className="mt-8" label="Ver detalhes do dia" onPress={() => undefined} variant="secondary" />
    </Screen>
  );
}
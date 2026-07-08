import {useEffect, useState} from "react";
import {View} from "react-native";

import {Card} from "@/components/system/card/Card";
import {Header} from "@/components/system/header/Header";
import {MetricCard} from "@/components/system/metric-card/MetricCard";
import {Screen} from "@/components/system/screen/Screen";
import {AppText} from "@/components/system/typography/AppText";
import {AppDateInput} from "@/components/ui/data-input/input";
import {useAttendanceContext} from "@/features/time-clock/hooks/useAttendance";
import {decimalHoursToLabel, formatDateLabel, minutesToLabel, punchEntries, workedMinutes} from "@/features/time-clock/utils/attendanceCalculations";
import {colors} from "@/theme/colors";

const dotColor = {
  success: colors.success,
  warning: "#f4be2a",
  info: colors.info,
  neutral: "#9ca3af"
} as const;

export function MyPointScreen() {
  const contextQuery = useAttendanceContext();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const record = contextQuery.data?.todayRecord;
  const expectedMinutes = Math.round((contextQuery.data?.dailyWorkloadHours ?? 8) * 60);
  const currentWorkedMinutes = workedMinutes(record, now);
  const remainingMinutes = Math.max(0, expectedMinutes - currentWorkedMinutes);

  return (
    <Screen backgroundColor={colors.surface}>
      <Header title="Meu Ponto" />
      <AppDateInput value={formatDateLabel(now)} />

      <View className="mt-5 flex-row gap-3">
        <MetricCard label="Horas trabalhadas" value={minutesToLabel(currentWorkedMinutes)} />
        <MetricCard label="Meta do dia" value={decimalHoursToLabel(contextQuery.data?.dailyWorkloadHours ?? 8)} />
      </View>

      <Card className="mt-5 gap-0 py-2">
        {punchEntries(record).map((entry) => (
          <View className="flex-row items-center gap-3 border-b border-[#f4f1f8] py-4" key={entry.label}>
            <View className="h-3 w-3 rounded-md" style={{ backgroundColor: dotColor[entry.tone] }} />
            <AppText className="flex-1">{entry.label}</AppText>
            <AppText className="font-inter-extrabold">{entry.time}</AppText>
          </View>
        ))}
        <View className="flex-row items-center gap-3 py-4">
          <View />
          <AppText className="flex-1">Total do dia</AppText>
          <AppText className="font-inter-extrabold">{minutesToLabel(currentWorkedMinutes)}</AppText>
        </View>
      </Card>

      <View className="mt-5 flex-row items-center gap-3 rounded-button bg-[#f6f7f6] p-4">
        <AppText className="font-inter-extrabold text-[26px]" color={remainingMinutes === 0 ? colors.success : colors.warning}>
          {remainingMinutes === 0 ? "✓" : "!"}
        </AppText>
        <AppText variant="subtitle">
          {remainingMinutes === 0
            ? "Meta diária atingida"
            : `Faltam ${minutesToLabel(remainingMinutes)} para atingir sua meta diária`}
        </AppText>
      </View>
    </Screen>
  );
}

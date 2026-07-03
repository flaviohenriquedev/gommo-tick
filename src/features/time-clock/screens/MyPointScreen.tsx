import { StyleSheet, View } from "react-native";
import { CalendarDays } from "lucide-react-native";

import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/ui/Header";
import { MetricCard } from "@/components/ui/MetricCard";
import { Screen } from "@/components/ui/Screen";
import { timeEntries } from "@/data/mock";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { spacing } from "@/theme/spacing";

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
      <View style={styles.datePicker}>
        <AppText style={styles.dateText}>02 de Julho de 2026</AppText>
        <CalendarDays color={colors.primary} size={18} />
      </View>

      <View style={styles.metricRow}>
        <MetricCard label="Horas trabalhadas" value="08h00" />
        <MetricCard label="Meta do dia" value="08h00" />
      </View>

      <Card style={styles.timeline}>
        {timeEntries.map((entry) => (
          <View key={entry.label} style={styles.timelineRow}>
            <View style={[styles.dot, { backgroundColor: dotColor[entry.tone] }]} />
            <AppText style={styles.timelineLabel}>{entry.label}</AppText>
            <AppText style={styles.timelineTime}>{entry.time}</AppText>
          </View>
        ))}
        <View style={styles.timelineRow}>
          <View />
          <AppText style={styles.timelineLabel}>Total do dia</AppText>
          <AppText style={styles.timelineTime}>08h00</AppText>
        </View>
      </Card>

      <View style={styles.successBox}>
        <AppText color={colors.success} style={styles.check}>
          ✓
        </AppText>
        <AppText variant="subtitle">Faltam 00h00 para atingir sua meta diária</AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  datePicker: {
    alignItems: "center",
    borderColor: "#eeeaf5",
    borderRadius: radius.input,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing[3],
    height: 52,
    justifyContent: "center"
  },
  dateText: {
    fontWeight: "800"
  },
  metricRow: {
    flexDirection: "row",
    gap: spacing[3],
    marginTop: spacing[5]
  },
  timeline: {
    gap: 0,
    marginTop: spacing[5],
    paddingVertical: spacing[2]
  },
  timelineRow: {
    alignItems: "center",
    borderBottomColor: "#f4f1f8",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing[3],
    paddingVertical: spacing[4]
  },
  dot: {
    borderRadius: 6,
    height: 12,
    width: 12
  },
  timelineLabel: {
    flex: 1
  },
  timelineTime: {
    fontWeight: "900"
  },
  successBox: {
    alignItems: "center",
    backgroundColor: "#f6f7f6",
    borderRadius: radius.input,
    flexDirection: "row",
    gap: spacing[3],
    marginTop: spacing[5],
    padding: spacing[4]
  },
  check: {
    fontSize: 26,
    fontWeight: "900"
  }
});

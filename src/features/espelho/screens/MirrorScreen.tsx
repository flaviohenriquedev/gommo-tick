import { StyleSheet, View } from "react-native";
import { CalendarDays } from "lucide-react-native";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/ui/Header";
import { MetricCard } from "@/components/ui/MetricCard";
import { Screen } from "@/components/ui/Screen";
import { mirrorDays } from "@/data/mock";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { spacing } from "@/theme/spacing";
import { periodLabel } from "@/utils/date";

export function MirrorScreen() {
  return (
    <Screen backgroundColor={colors.surface}>
      <Header title="Espelho de Ponto" />
      <View style={styles.datePicker}>
        <AppText style={styles.dateText}>{periodLabel}</AppText>
        <CalendarDays color={colors.primary} size={18} />
      </View>

      <View style={styles.metricRow}>
        <MetricCard label="Total no período" value="176h00" />
        <MetricCard label="Banco de horas" value="+08h30" accent={colors.success} />
      </View>

      <View style={styles.list}>
        {mirrorDays.map((day) => (
          <View key={day.day} style={styles.barRow}>
            <AppText variant="label" color={colors.text} style={styles.day}>
              {day.day}
            </AppText>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${day.progress}%`,
                    backgroundColor: day.tone === "warning" ? "#f4be2a" : "#4cc26f"
                  }
                ]}
              />
            </View>
            <AppText style={styles.hours}>{day.hours}</AppText>
          </View>
        ))}
      </View>

      <Button label="Ver detalhes do dia" onPress={() => undefined} variant="secondary" style={styles.action} />
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
  list: {
    gap: spacing[5],
    marginTop: spacing[6]
  },
  barRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[3]
  },
  day: {
    width: 80
  },
  barTrack: {
    backgroundColor: "#f0edf5",
    borderRadius: 20,
    flex: 1,
    height: 9,
    overflow: "hidden"
  },
  barFill: {
    borderRadius: 20,
    height: "100%"
  },
  hours: {
    fontWeight: "900",
    width: 56
  },
  action: {
    marginTop: "auto"
  }
});

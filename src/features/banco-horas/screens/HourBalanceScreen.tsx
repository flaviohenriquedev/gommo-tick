import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/ui/Header";
import { Screen } from "@/components/ui/Screen";
import { hourBalanceEntries } from "@/data/mock";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { spacing } from "@/theme/spacing";

const toneColor = {
  success: colors.success,
  error: colors.error,
  neutral: colors.text
} as const;

export function HourBalanceScreen() {
  return (
    <Screen backgroundColor={colors.surface}>
      <Header title="Extrato de Horas" />
      <View style={styles.balance}>
        <AppText variant="label">Saldo Atual</AppText>
        <AppText style={styles.balanceValue}>+08h30</AppText>
        <AppText style={styles.balanceLabel}>Banco de Horas</AppText>
      </View>

      <View style={styles.segmented}>
        <View style={styles.segmentActive}>
          <AppText color={colors.primary} style={styles.segmentText}>
            Histórico
          </AppText>
        </View>
        <View style={styles.segment}>
          <AppText variant="label">Resumos</AppText>
        </View>
      </View>

      <Card style={styles.list}>
        {hourBalanceEntries.map((entry) => (
          <View key={`${entry.title}-${entry.date}`} style={styles.row}>
            <View>
              <AppText style={styles.rowTitle}>{entry.title}</AppText>
              <AppText variant="label">{entry.date}</AppText>
            </View>
            <AppText style={[styles.rowValue, { color: toneColor[entry.tone] }]}>{entry.value}</AppText>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  balance: {
    alignItems: "center",
    backgroundColor: "#faf9fd",
    borderRadius: radius.card,
    padding: spacing[5]
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 40
  },
  balanceLabel: {
    fontWeight: "800"
  },
  segmented: {
    borderBottomColor: "#eeeaf5",
    borderBottomWidth: 1,
    flexDirection: "row",
    marginTop: spacing[5]
  },
  segment: {
    alignItems: "center",
    flex: 1,
    paddingVertical: spacing[3]
  },
  segmentActive: {
    alignItems: "center",
    borderBottomColor: colors.primary,
    borderBottomWidth: 2,
    flex: 1,
    paddingVertical: spacing[3]
  },
  segmentText: {
    fontWeight: "900"
  },
  list: {
    marginTop: spacing[4],
    paddingVertical: spacing[1]
  },
  row: {
    alignItems: "center",
    borderBottomColor: "#f2eff7",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing[4]
  },
  rowTitle: {
    fontWeight: "800"
  },
  rowValue: {
    fontWeight: "900"
  }
});

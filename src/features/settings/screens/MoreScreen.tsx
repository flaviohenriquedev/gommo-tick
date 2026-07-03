import { Pressable, StyleSheet, View } from "react-native";
import { ChevronRight } from "lucide-react-native";

import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/ui/Header";
import { Screen } from "@/components/ui/Screen";
import { settingsItems } from "@/data/mock";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

export function MoreScreen() {
  return (
    <Screen backgroundColor={colors.surface}>
      <Header title="Mais" canGoBack={false} />
      <AppText variant="label" style={styles.section}>
        OPÇÕES
      </AppText>
      <Card style={styles.card}>
        {settingsItems.map(({ label, value, icon: Icon }) => (
          <Pressable key={label} style={styles.row}>
            <View style={styles.rowLabel}>
              <Icon color={colors.primary} size={20} />
              <AppText>{label}</AppText>
            </View>
            <View style={styles.rowValue}>
              {value ? <AppText variant="label">{value}</AppText> : null}
              <ChevronRight color={colors.muted} size={18} />
            </View>
          </Pressable>
        ))}
      </Card>

      <AppText variant="label" style={styles.section}>
        SOBRE
      </AppText>
      <Card style={styles.version}>
        <AppText>Versão do App</AppText>
        <AppText variant="label">1.0.0</AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing[2],
    marginTop: spacing[5]
  },
  card: {
    paddingVertical: spacing[2]
  },
  row: {
    alignItems: "center",
    borderBottomColor: "#f2eff7",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing[4]
  },
  rowLabel: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[3]
  },
  rowValue: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[1]
  },
  version: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  }
});

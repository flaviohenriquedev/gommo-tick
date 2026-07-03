import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Bell } from "lucide-react-native";
import { router } from "expo-router";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { MenuTile } from "@/features/home/components/MenuTile";
import { ProgressRing } from "@/features/home/components/ProgressRing";
import { menuItems, todaySummary } from "@/data/mock";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

export function HomeScreen() {
  const { width } = useWindowDimensions();
  const horizontalPadding = spacing[5] * 2;
  const gridGap = spacing[3];
  const availableGridWidth = width - horizontalPadding;
  const tileSize = Math.min(104, Math.floor((availableGridWidth - gridGap * 2) / 3));

  return (
    <Screen padded={false} backgroundColor={colors.primary}>
      <View style={styles.hero}>
        <View style={styles.topRow}>
          <View style={styles.helloRow}>
            <View style={styles.avatar}>
              <AppText style={styles.avatarText}>FH</AppText>
            </View>
            <View>
              <AppText color={colors.surface} style={styles.helloName}>
                Olá, {todaySummary.employeeName}
              </AppText>
              <AppText color="rgba(255,255,255,0.78)" variant="label">
                {todaySummary.greeting}
              </AppText>
            </View>
          </View>
          <Bell color={colors.surface} size={23} />
        </View>
      </View>

      <View style={styles.sheet}>
        <AppText style={styles.sectionTitle}>Resumo de hoje</AppText>
        <AppText variant="label">{todaySummary.date}</AppText>

        <Card style={styles.summaryCard}>
          <View>
            <AppText variant="label">Jornada do dia</AppText>
            <AppText style={styles.hours}>{todaySummary.plannedHours}</AppText>
            <AppText variant="label">Trabalhadas</AppText>
          </View>
          <ProgressRing value={todaySummary.progress} />
        </Card>

        <Button label="Registrar Ponto" onPress={() => router.push("/ponto")} style={styles.primaryAction} />

        <View style={styles.grid}>
          {menuItems.map((item) => (
            <MenuTile
              key={item.label}
              href={item.href}
              icon={item.icon}
              label={item.label}
              size={tileSize}
            />
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[6]
  },
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  helloRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[3]
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#e7ddff",
    borderColor: "rgba(255,255,255,0.85)",
    borderRadius: 24,
    borderWidth: 3,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  avatarText: {
    color: colors.primary,
    fontWeight: "900"
  },
  helloName: {
    fontSize: 18,
    fontWeight: "800"
  },
  sheet: {
    backgroundColor: colors.page,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    flex: 1,
    marginTop: spacing[6],
    padding: spacing[5]
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: spacing[1]
  },
  summaryCard: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing[5]
  },
  hours: {
    fontSize: 31,
    fontWeight: "900",
    lineHeight: 36,
    marginVertical: spacing[2]
  },
  primaryAction: {
    marginTop: spacing[5]
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: spacing[3],
    justifyContent: "center",
    marginTop: spacing[5],
    rowGap: spacing[3]
  }
});

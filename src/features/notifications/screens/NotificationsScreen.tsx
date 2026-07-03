import { StyleSheet, View } from "react-native";
import { BellRing } from "lucide-react-native";

import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/ui/Header";
import { Screen } from "@/components/ui/Screen";
import { notifications } from "@/data/mock";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

export function NotificationsScreen() {
  const unreadCount = notifications.length;

  return (
    <Screen backgroundColor={colors.surface}>
      <Header title="Notificações" />

      <Card style={styles.summary}>
        <View style={styles.summaryIcon}>
          <BellRing color={colors.primary} size={24} />
        </View>
        <View style={styles.summaryText}>
          <AppText style={styles.summaryTitle}>{unreadCount} novas atualizações</AppText>
          <AppText variant="label">Acompanhe avisos importantes sobre sua jornada.</AppText>
        </View>
      </Card>

      <AppText variant="label" style={styles.section}>
        RECENTES
      </AppText>

      <Card style={styles.list}>
        {notifications.map((item) => (
          <View key={`${item.title}-${item.time}`} style={styles.row}>
            <View style={[styles.dot, styles[item.tone]]} />
            <View style={styles.content}>
              <View style={styles.rowHeader}>
                <AppText style={styles.title}>{item.title}</AppText>
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

const styles = StyleSheet.create({
  summary: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[3]
  },
  summaryIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  summaryText: {
    flex: 1,
    gap: spacing[1]
  },
  summaryTitle: {
    fontWeight: "900"
  },
  section: {
    marginBottom: spacing[2],
    marginTop: spacing[5]
  },
  list: {
    paddingVertical: spacing[1]
  },
  row: {
    borderBottomColor: "#f2eff7",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing[3],
    paddingVertical: spacing[4]
  },
  dot: {
    borderRadius: 6,
    height: 12,
    marginTop: 4,
    width: 12
  },
  content: {
    flex: 1,
    gap: spacing[1]
  },
  rowHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  title: {
    flex: 1,
    fontWeight: "900",
    paddingRight: spacing[3]
  },
  success: {
    backgroundColor: colors.success
  },
  warning: {
    backgroundColor: colors.warning
  },
  info: {
    backgroundColor: colors.info
  },
  neutral: {
    backgroundColor: colors.muted
  }
});

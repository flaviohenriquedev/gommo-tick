import { StyleSheet, View } from "react-native";
import { Plus } from "lucide-react-native";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/ui/Header";
import { Screen } from "@/components/ui/Screen";
import { StatusPill } from "@/components/ui/StatusPill";
import { requests } from "@/data/mock";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

export function RequestsScreen() {
  return (
    <Screen backgroundColor={colors.surface}>
      <Header title="Solicitações" />
      <View style={styles.segmented}>
        <View style={styles.segmentActive}>
          <AppText color={colors.primary} style={styles.segmentText}>
            Minhas Solicitações
          </AppText>
        </View>
        <View style={styles.segment}>
          <AppText variant="label">Histórico</AppText>
        </View>
      </View>

      <Card style={styles.list}>
        {requests.map((request) => (
          <View key={`${request.title}-${request.date}`} style={styles.row}>
            <View style={styles.requestInfo}>
              <View style={[styles.requestDot, styles[request.tone]]} />
              <View>
                <AppText style={styles.rowTitle}>{request.title}</AppText>
                <AppText variant="label">{request.date}</AppText>
              </View>
            </View>
            <StatusPill label={request.status} tone={request.tone} />
          </View>
        ))}
      </Card>

      <Button label="Nova Solicitação" onPress={() => undefined} style={styles.action} />
      <View pointerEvents="none" style={styles.plusIcon}>
        <Plus color={colors.surface} size={18} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  segmented: {
    borderBottomColor: "#eeeaf5",
    borderBottomWidth: 1,
    flexDirection: "row"
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
    marginTop: spacing[5],
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
  requestInfo: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[3]
  },
  requestDot: {
    borderRadius: 6,
    height: 12,
    width: 12
  },
  success: {
    backgroundColor: colors.success
  },
  warning: {
    backgroundColor: colors.warning
  },
  error: {
    backgroundColor: colors.error
  },
  rowTitle: {
    fontWeight: "800"
  },
  action: {
    marginTop: "auto"
  },
  plusIcon: {
    alignItems: "center",
    height: 0,
    justifyContent: "center",
    left: spacing[6],
    top: -36,
    width: 24
  }
});

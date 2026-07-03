import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { CalendarClock, Clock3, FilePenLine, Plus } from "lucide-react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { AppText } from "@/components/ui/AppText";
import { AppModal } from "@/components/ui/AppModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/ui/Header";
import { Screen } from "@/components/ui/Screen";
import { StatusPill } from "@/components/ui/StatusPill";
import { requests } from "@/data/mock";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

type RequestsScreenProps = {
  primaryTabLabel?: string;
  title?: string;
};

export function RequestsScreen({
  primaryTabLabel = "Minhas Solicitações",
  title = "Solicitações"
}: RequestsScreenProps) {
  const [isRequestModalVisible, setRequestModalVisible] = useState(false);

  return (
    <Screen backgroundColor={colors.surface}>
      <Header title={title} />
      <View style={styles.segmented}>
        <View style={styles.segmentActive}>
          <AppText color={colors.primary} style={styles.segmentText}>
            {primaryTabLabel}
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

      <Button
        label="Nova Solicitação"
        onPress={() => setRequestModalVisible(true)}
        style={styles.action}
      />
      <View pointerEvents="none" style={styles.plusIcon}>
        <Plus color={colors.surface} size={18} />
      </View>

      <AppModal
        onClose={() => setRequestModalVisible(false)}
        title="Nova Solicitação"
        visible={isRequestModalVisible}
      >
        <AppText variant="label">Escolha o tipo de solicitação que deseja abrir.</AppText>

        <View style={styles.modalOptions}>
          <Animated.View entering={FadeInUp.delay(80).duration(260)} style={styles.modalOption}>
            <View style={styles.modalIcon}>
              <Clock3 color={colors.primary} size={20} />
            </View>
            <View style={styles.modalText}>
              <AppText style={styles.modalTitle}>Ajuste de ponto</AppText>
              <AppText variant="label">Corrigir entrada, saída ou intervalo.</AppText>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(130).duration(260)} style={styles.modalOption}>
            <View style={styles.modalIcon}>
              <CalendarClock color={colors.primary} size={20} />
            </View>
            <View style={styles.modalText}>
              <AppText style={styles.modalTitle}>Banco de horas</AppText>
              <AppText variant="label">Solicitar compensação ou conferência.</AppText>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(180).duration(260)} style={styles.modalOption}>
            <View style={styles.modalIcon}>
              <FilePenLine color={colors.primary} size={20} />
            </View>
            <View style={styles.modalText}>
              <AppText style={styles.modalTitle}>Outro pedido</AppText>
              <AppText variant="label">Enviar uma solicitação manual.</AppText>
            </View>
          </Animated.View>
        </View>

        <Button label="Continuar" onPress={() => setRequestModalVisible(false)} />
      </AppModal>
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
    marginTop: spacing[8]
  },
  plusIcon: {
    alignItems: "center",
    height: 0,
    justifyContent: "center",
    left: spacing[6],
    top: -36,
    width: 24
  },
  modalOptions: {
    gap: spacing[3]
  },
  modalOption: {
    alignItems: "center",
    backgroundColor: "#faf8ff",
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing[3],
    padding: spacing[3]
  },
  modalIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  modalText: {
    flex: 1,
    gap: spacing[1]
  },
  modalTitle: {
    fontWeight: "900"
  }
});

import { StyleSheet, View } from "react-native";
import { Camera } from "lucide-react-native";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/ui/Header";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { todayLabel } from "@/utils/date";

export function RegisterPointScreen() {
  return (
    <Screen scroll={false} backgroundColor={colors.surface}>
      <Header title="Registrar Ponto" />
      <AppText variant="clock" center>
        09:30:45
      </AppText>
      <AppText variant="subtitle" center>
        {todayLabel}
      </AppText>
      <AppText style={styles.status} center>
        Dentro do horário
      </AppText>

      <View style={styles.cameraCircle}>
        <Camera color={colors.primary} size={52} strokeWidth={1.8} />
      </View>
      <AppText style={styles.selfie} center>
        Tire uma selfie
      </AppText>
      <AppText variant="subtitle" center>
        para confirmar seu ponto
      </AppText>

      <Card style={styles.lastCard}>
        <View>
          <AppText variant="label" color={colors.text}>
            Último registro
          </AppText>
          <AppText variant="label" color={colors.success}>
            Entrada
          </AppText>
          <AppText style={styles.lastTime}>08:00</AppText>
        </View>
        <AppText variant="subtitle">Hoje</AppText>
      </Card>

      <Button label="Registrar Entrada" onPress={() => undefined} style={styles.action} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  status: {
    color: colors.success,
    fontWeight: "800",
    marginTop: spacing[2]
  },
  cameraCircle: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#faf7ff",
    borderColor: "#8b5cf6",
    borderRadius: 88,
    borderWidth: 3,
    height: 176,
    justifyContent: "center",
    marginTop: spacing[12],
    width: 176
  },
  selfie: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "900",
    marginTop: spacing[6]
  },
  lastCard: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto"
  },
  lastTime: {
    fontSize: 23,
    fontWeight: "900",
    lineHeight: 28
  },
  action: {
    marginTop: spacing[4]
  }
});

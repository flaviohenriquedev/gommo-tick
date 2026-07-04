import { View } from "react-native";
import { Camera } from "lucide-react-native";

import { Card } from "@/components/system/card/Card";
import { Header } from "@/components/system/header/Header";
import { Screen } from "@/components/system/screen/Screen";
import { AppText } from "@/components/system/typography/AppText";
import { Button } from "@/components/ui/action/button/Button";
import { colors } from "@/theme/colors";
import { todayLabel } from "@/utils/date";

export function RegisterPointScreen() {
  return (
    <Screen backgroundColor={colors.surface} scroll={false}>
      <Header title="Registrar Ponto" />
      <AppText center variant="clock">
        09:30:45
      </AppText>
      <AppText center variant="subtitle">
        {todayLabel}
      </AppText>
      <AppText center className="mt-2 font-inter-extrabold text-success">
        Dentro do horário
      </AppText>

      <View className="mt-12 h-44 w-44 items-center justify-center self-center rounded-[88px] border-[3px] border-[#8b5cf6] bg-[#faf7ff]">
        <Camera color={colors.primary} size={52} strokeWidth={1.8} />
      </View>
      <AppText center className="mt-6 font-inter-extrabold text-lg text-primary">
        Tire uma selfie
      </AppText>
      <AppText center variant="subtitle">
        para confirmar seu ponto
      </AppText>

      <Card className="mt-auto flex-row items-end justify-between">
        <View>
          <AppText color={colors.text} variant="label">
            Último registro
          </AppText>
          <AppText color={colors.success} variant="label">
            Entrada
          </AppText>
          <AppText className="font-inter-extrabold text-[23px] leading-7">08:00</AppText>
        </View>
        <AppText variant="subtitle">Hoje</AppText>
      </Card>

      <Button className="mt-4" label="Registrar Entrada" onPress={() => undefined} />
    </Screen>
  );
}
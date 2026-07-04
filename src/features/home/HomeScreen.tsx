import { Pressable, useWindowDimensions, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Bell } from "lucide-react-native";
import { router } from "expo-router";

import { Card } from "@/components/system/card/Card";
import { Screen } from "@/components/system/screen/Screen";
import { AppText } from "@/components/system/typography/AppText";
import { Button } from "@/components/ui/action/button/Button";
import { menuItems, todaySummary } from "@/data/mock";
import { MenuTile } from "@/features/home/components/MenuTile";
import { ProgressRing } from "@/features/home/components/ProgressRing";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

export function HomeScreen() {
  const { width } = useWindowDimensions();
  const horizontalPadding = spacing[5] * 2;
  const gridGap = spacing[3];
  const availableGridWidth = width - horizontalPadding;
  const tileSize = Math.min(104, Math.floor((availableGridWidth - gridGap * 2) / 3));

  return (
    <Screen backgroundColor={colors.primary} padded={false}>
      <View className="bg-primary px-5 pt-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Pressable
              accessibilityRole="button"
              className="h-12 w-12 items-center justify-center rounded-3xl border-[3px] border-[rgba(255,255,255,0.85)] bg-[#e7ddff]"
              onPress={() => {
                Haptics.selectionAsync();
                router.push("/profile");
              }}
              style={({ pressed }) => (pressed ? { opacity: 0.68, transform: [{ scale: 0.94 }] } : null)}
            >
              <AppText className="font-inter-extrabold text-primary">FH</AppText>
            </Pressable>
            <View>
              <AppText className="font-inter-extrabold text-lg" color={colors.surface}>
                Olá, {todaySummary.employeeName}
              </AppText>
              <AppText color="rgba(255,255,255,0.78)" variant="label">
                {todaySummary.greeting}
              </AppText>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            className="h-10 w-10 items-center justify-center rounded-button"
            onPress={() => {
              Haptics.selectionAsync();
              router.push("/notifications");
            }}
            style={({ pressed }) => (pressed ? { opacity: 0.68, transform: [{ scale: 0.94 }] } : null)}
          >
            <Bell color={colors.surface} size={23} />
          </Pressable>
        </View>
      </View>

      <View className="mt-6 flex-1 rounded-t-sheet bg-page p-5">
        <AppText className="mb-1 font-inter-extrabold text-lg">Resumo de hoje</AppText>
        <AppText variant="label">{todaySummary.date}</AppText>

        <Card className="mt-3 min-h-[214px] gap-3">
          <View className="flex-row items-center justify-between">
            <View>
              <AppText variant="label">Jornada do dia</AppText>
              <AppText className="my-2 font-inter-extrabold text-[31px] leading-9">
                {todaySummary.plannedHours}
              </AppText>
              <AppText variant="label">Trabalhadas</AppText>
            </View>
            <ProgressRing value={todaySummary.progress} />
          </View>

          <View className="h-px bg-[#f0eaf8]" />

          <View className="flex-row gap-3">
            <View className="flex-1 gap-1 rounded-[14px] bg-primarySoft px-3 py-3">
              <AppText variant="label">Saldo hoje</AppText>
              <AppText className="font-inter-extrabold text-lg text-primary">
                {todaySummary.currentBalance}
              </AppText>
            </View>
            <View className="flex-1 gap-1 rounded-[14px] bg-primarySoft px-3 py-3">
              <AppText variant="label">Saída prevista</AppText>
              <AppText className="font-inter-extrabold text-lg text-primary">
                {todaySummary.expectedExit}
              </AppText>
            </View>
          </View>
        </Card>

        <Button className="mt-3" label="Registrar Ponto" onPress={() => router.push("/register-point")} />

        <View className="mt-3 flex-row flex-wrap justify-center gap-3">
          {menuItems.map((item) => (
            <MenuTile key={item.label} href={item.href} icon={item.icon} label={item.label} size={tileSize} />
          ))}
        </View>
      </View>
    </Screen>
  );
}
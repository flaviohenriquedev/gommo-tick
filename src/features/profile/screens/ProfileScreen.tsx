import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

import { Button } from "@/components/ui/action/button/Button";
import { Card } from "@/components/system/card/Card";
import { Screen } from "@/components/system/screen/Screen";
import { AppText } from "@/components/system/typography/AppText";
import { profileItems } from "@/data/mock";
import { useAuthStore } from "@/store/authStore";
import { colors } from "@/theme/colors";

export function ProfileScreen() {
  const signOut = useAuthStore((state) => state.signOut);

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/login");
  };

  return (
    <Screen backgroundColor={colors.surface} padded={false}>
      <View className="items-center rounded-b-sheet bg-primary pb-8 pt-10">
        <Pressable
          accessibilityRole="button"
          className="absolute left-5 top-10 z-10 h-10 w-10 items-center justify-center rounded-button"
          onPress={() => router.back()}
        >
          <ChevronLeft color={colors.surface} size={28} strokeWidth={2.2} />
        </Pressable>
        <View className="h-[88px] w-[88px] items-center justify-center rounded-[44px] border-4 border-surface bg-[#e7ddff]">
          <AppText className="font-inter-extrabold text-2xl text-primary">FH</AppText>
        </View>
        <AppText className="mt-3 font-inter-extrabold text-xl" color={colors.surface}>
          Flávio Henrique
        </AppText>
        <AppText color="rgba(255,255,255,0.78)" variant="label">
          Desenvolvedor
        </AppText>
      </View>

      <View className="flex-1 p-5">
        <Card className="-mt-10 py-2">
          {profileItems.map(({ label, value, icon: Icon }) => (
            <Pressable
              className="flex-row items-center justify-between border-b border-[#f2eff7] py-4"
              key={label}
              style={({ pressed }) => (pressed ? { opacity: 0.68, transform: [{ scale: 0.99 }] } : null)}
            >
              <View className="flex-row items-center gap-3">
                <Icon color={colors.primary} size={20} />
                <AppText>{label}</AppText>
              </View>
              <View className="flex-row items-center gap-1">
                {value ? <AppText variant="label">{value}</AppText> : null}
                <ChevronRight color={colors.muted} size={18} />
              </View>
            </Pressable>
          ))}
        </Card>

        <Button className="mt-8" label="Sair da Conta" onPress={handleSignOut} variant="danger" />
      </View>
    </Screen>
  );
}
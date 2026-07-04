import { View } from "react-native";

import { AppText } from "@/components/system/typography/AppText";

export function ProgressRing({ value }: { value: number }) {
  return (
    <View className="h-[76px] w-[76px] items-center justify-center rounded-[38px] border-8 border-primary bg-primarySoft">
      <View className="h-14 w-14 items-center justify-center rounded-[28px] bg-surface">
        <AppText className="font-inter-extrabold text-sm text-primary">{value}%</AppText>
      </View>
    </View>
  );
}
import { View } from "react-native";

import { colors } from "@/theme/colors";

import { AppText } from "../typography/AppText";

type MetricCardProps = {
  accent?: string;
  label: string;
  value: string;
};

export function MetricCard({ accent = colors.text, label, value }: MetricCardProps) {
  return (
    <View className="flex-1 rounded-button bg-[#faf9fd] p-4">
      <AppText variant="label">{label}</AppText>
      <AppText className="mt-1 font-inter-extrabold text-2xl leading-[30px]" color={accent}>
        {value}
      </AppText>
    </View>
  );
}
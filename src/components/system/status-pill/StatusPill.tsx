import { View } from "react-native";

import { colors } from "@/theme/colors";

import { AppText } from "../typography/AppText";

type PillTone = "success" | "warning" | "error" | "neutral";

const toneMap: Record<PillTone, { backgroundColor: string; color: string }> = {
  success: { backgroundColor: "#dff6e8", color: colors.success },
  warning: { backgroundColor: "#fff1cc", color: "#aa7100" },
  error: { backgroundColor: "#fee2e2", color: colors.error },
  neutral: { backgroundColor: colors.primarySoft, color: colors.primary }
};

type StatusPillProps = {
  label: string;
  tone?: PillTone;
};

export function StatusPill({ label, tone = "neutral" }: StatusPillProps) {
  const colorSet = toneMap[tone];

  return (
    <View className="rounded-full px-3 py-1" style={{ backgroundColor: colorSet.backgroundColor }}>
      <AppText color={colorSet.color} variant="label">
        {label}
      </AppText>
    </View>
  );
}
import { StyleSheet, View } from "react-native";

import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { spacing } from "@/theme/spacing";

import { AppText } from "./AppText";

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
    <View style={[styles.pill, { backgroundColor: colorSet.backgroundColor }]}>
      <AppText variant="label" color={colorSet.color}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1]
  }
});

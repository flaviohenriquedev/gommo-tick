import { StyleSheet, View } from "react-native";

import { colors } from "@/theme/colors";
import { fontFamily } from "@/theme/typography";
import { radius } from "@/theme/radius";
import { spacing } from "@/theme/spacing";

import { AppText } from "./AppText";

type MetricCardProps = {
  label: string;
  value: string;
  accent?: string;
};

export function MetricCard({ label, value, accent = colors.text }: MetricCardProps) {
  return (
    <View style={styles.metric}>
      <AppText variant="label">{label}</AppText>
      <AppText style={[styles.value, { color: accent }]}>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  metric: {
    backgroundColor: "#faf9fd",
    borderRadius: radius.input,
    flex: 1,
    padding: spacing[4]
  },
  value: {
    fontFamily: fontFamily.extraBold,
    fontSize: 24,
    lineHeight: 30,
    marginTop: spacing[1]
  }
});

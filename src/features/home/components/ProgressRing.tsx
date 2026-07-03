import { StyleSheet, View } from "react-native";

import { colors } from "@/theme/colors";
import { fontFamily } from "@/theme/typography";

import { AppText } from "@/components/ui/AppText";

type ProgressRingProps = {
  value: number;
};

export function ProgressRing({ value }: ProgressRingProps) {
  return (
    <View style={styles.ring}>
      <View style={styles.inner}>
        <AppText style={styles.value}>{value}%</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
    borderRadius: 38,
    borderWidth: 8,
    height: 76,
    justifyContent: "center",
    width: 76
  },
  inner: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    width: 56
  },
  value: {
    color: colors.primary,
    fontFamily: fontFamily.extraBold,
    fontSize: 14
  }
});

import { Pressable, StyleSheet } from "react-native";
import type { Href } from "expo-router";
import { router } from "expo-router";
import type { LucideIcon } from "lucide-react-native";

import { AppText } from "@/components/ui/AppText";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { spacing } from "@/theme/spacing";

type MenuTileProps = {
  label: string;
  href: string;
  icon: LucideIcon;
  size: number;
};

export function MenuTile({ label, href, icon: Icon, size }: MenuTileProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(href as Href)}
      style={({ pressed }) => [styles.tile, { height: size, width: size }, pressed ? styles.pressed : null]}
    >
      <Icon color={colors.primary} size={24} strokeWidth={2.1} />
      <AppText variant="label" color={colors.text} center style={styles.label}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: "#eeeaf5",
    borderRadius: radius.input,
    borderWidth: 1,
    gap: spacing[4],
    justifyContent: "center",
    padding: spacing[2]
  },
  pressed: {
    opacity: 0.72
  },
  label: {
    fontWeight: "800"
  }
});

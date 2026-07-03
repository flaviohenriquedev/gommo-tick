import { Pressable, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import type { Href } from "expo-router";
import { router } from "expo-router";
import type { LucideIcon } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated";

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
  const scale = useSharedValue(1);
  const lift = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: lift.value }, { scale: scale.value }]
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          Haptics.selectionAsync();
          router.push(href as Href);
        }}
        onPressIn={() => {
          // Reanimated shared values are intentionally mutable outside React state.
          // eslint-disable-next-line react-hooks/immutability
          scale.value = withSpring(0.94, { damping: 18, stiffness: 420 });
          // eslint-disable-next-line react-hooks/immutability
          lift.value = withSpring(2, { damping: 18, stiffness: 420 });
        }}
        onPressOut={() => {
          // eslint-disable-next-line react-hooks/immutability
          scale.value = withSpring(1, { damping: 16, stiffness: 360 });
          // eslint-disable-next-line react-hooks/immutability
          lift.value = withSpring(0, { damping: 16, stiffness: 360 });
        }}
        style={[styles.tile, { height: size, width: size }]}
      >
        <Icon color={colors.primary} size={24} strokeWidth={2.1} />
        <AppText variant="label" color={colors.text} center style={styles.label}>
          {label}
        </AppText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: "#eeeaf5",
    borderRadius: radius.input,
    borderWidth: 1,
    gap: spacing[3],
    justifyContent: "center",
    padding: spacing[2]
  },
  label: {
    fontWeight: "800"
  }
});

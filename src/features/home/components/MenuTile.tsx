import { Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import type { Href } from "expo-router";
import { router } from "expo-router";
import type { LucideIcon } from "lucide-react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { AppText } from "@/components/system/typography/AppText";
import { colors } from "@/theme/colors";

type MenuTileProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  size: number;
};

export function MenuTile({ href, icon: Icon, label, size }: MenuTileProps) {
  const scale = useSharedValue(1);
  const lift = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: lift.value }, { scale: scale.value }]
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityRole="button"
        className="items-center justify-center gap-3 rounded-button border border-[#eeeaf5] bg-surface p-2"
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
        style={{ height: size, width: size }}
      >
        <Icon color={colors.primary} size={24} strokeWidth={2.1} />
        <AppText center className="font-inter-extrabold" color={colors.text} variant="label">
          {label}
        </AppText>
      </Pressable>
    </Animated.View>
  );
}
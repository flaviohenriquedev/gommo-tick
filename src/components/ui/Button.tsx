import type { PropsWithChildren } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle
} from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated";

import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { spacing } from "@/theme/spacing";

import { AppText } from "./AppText";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = PropsWithChildren<
  Omit<PressableProps, "style"> & {
    label: string;
    style?: StyleProp<ViewStyle>;
    variant?: ButtonVariant;
  }
>;

export function Button({ label, variant = "primary", onPress, disabled, style, ...props }: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePressIn = () => {
    // Reanimated shared values are intentionally mutable outside React state.
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSpring(0.97, { damping: 18, stiffness: 420 });
  };

  const handlePressOut = () => {
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSpring(1, { damping: 18, stiffness: 420 });
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        {...props}
        android_ripple={{ color: "rgba(255,255,255,0.22)", borderless: false }}
        disabled={disabled}
        onPress={(event) => {
          Haptics.selectionAsync();
          onPress?.(event);
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.base, styles[variant], disabled ? styles.disabled : null, style]}
      >
        <View style={styles.content}>
          <AppText
            variant="button"
            color={variant === "primary" ? colors.surface : variant === "danger" ? colors.error : colors.primary}
          >
            {label}
          </AppText>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: radius.button,
    height: 52,
    justifyContent: "center",
    overflow: "hidden",
    paddingHorizontal: spacing[5]
  },
  content: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[2],
    justifyContent: "center"
  },
  primary: {
    backgroundColor: colors.primary,
    shadowColor: "rgba(109, 40, 217, 0.26)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 3
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: "rgba(109, 40, 217, 0.28)",
    borderWidth: 1
  },
  danger: {
    backgroundColor: colors.surface,
    borderColor: "rgba(220, 38, 38, 0.24)",
    borderWidth: 1
  },
  disabled: {
    opacity: 0.56
  }
});

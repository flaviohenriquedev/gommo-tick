import type { PropsWithChildren } from "react";
import { Pressable, View, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { colors } from "@/theme/colors";
import { cn } from "@/utils/cn";

import { AppText } from "../../../system/typography/AppText";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = PropsWithChildren<
  Omit<PressableProps, "style"> & {
    className?: string;
    label: string;
    style?: StyleProp<ViewStyle>;
    variant?: ButtonVariant;
  }
>;

const variantClassName: Record<ButtonVariant, string> = {
  primary: "bg-primary shadow-lg",
  secondary: "border border-[rgba(109,40,217,0.28)] bg-surface",
  danger: "border border-[rgba(220,38,38,0.24)] bg-surface"
};

export function Button({
  className,
  disabled,
  label,
  onPress,
  style,
  variant = "primary",
  ...props
}: ButtonProps) {
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
        className={cn(
          "h-[52px] items-center justify-center overflow-hidden rounded-button px-5",
          variantClassName[variant],
          disabled && "opacity-60",
          className
        )}
        disabled={disabled}
        onPress={(event) => {
          Haptics.selectionAsync();
          onPress?.(event);
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={style}
      >
        <View className="flex-row items-center justify-center gap-2">
          <AppText
            color={variant === "primary" ? colors.surface : variant === "danger" ? colors.error : colors.primary}
            variant="button"
          >
            {label}
          </AppText>
        </View>
      </Pressable>
    </Animated.View>
  );
}
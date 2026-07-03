import type { PropsWithChildren } from "react";
import { Text, type TextProps, StyleSheet } from "react-native";

import { colors } from "@/theme/colors";
import { fontFamily } from "@/theme/typography";

type TextVariant = "title" | "subtitle" | "body" | "label" | "clock" | "button";

type AppTextProps = PropsWithChildren<
  TextProps & {
    variant?: TextVariant;
    color?: string;
    center?: boolean;
  }
>;

export function AppText({
  variant = "body",
  color,
  center = false,
  style,
  children,
  ...props
}: AppTextProps) {
  return (
    <Text
      {...props}
      style={[
        styles.base,
        styles[variant],
        color ? { color } : null,
        center ? styles.center : null,
        style
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: colors.text,
    fontFamily: fontFamily.regular
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    lineHeight: 34
  },
  subtitle: {
    color: colors.muted,
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    lineHeight: 20
  },
  body: {
    fontSize: 15,
    lineHeight: 22
  },
  label: {
    color: colors.muted,
    fontFamily: fontFamily.semibold,
    fontSize: 12,
    lineHeight: 16
  },
  clock: {
    fontFamily: fontFamily.extraBold,
    fontSize: 46,
    lineHeight: 56
  },
  button: {
    color: colors.surface,
    fontFamily: fontFamily.semibold,
    fontSize: 15
  },
  center: {
    textAlign: "center"
  }
});

import type { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  padded?: boolean;
  backgroundColor?: string;
}>;

export function Screen({
  children,
  scroll = true,
  padded = true,
  backgroundColor = colors.page
}: ScreenProps) {
  const contentStyle = [styles.content, padded ? styles.padded : null];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }]}>
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={contentStyle}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={contentStyle}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1
  },
  content: {
    flexGrow: 1
  },
  padded: {
    padding: spacing[5]
  }
});

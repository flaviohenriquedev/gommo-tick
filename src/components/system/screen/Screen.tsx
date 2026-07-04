import type { PropsWithChildren } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/theme/colors";
import { cn } from "@/utils/cn";

type ScreenProps = PropsWithChildren<{
  backgroundColor?: string;
  padded?: boolean;
  scroll?: boolean;
}>;

export function Screen({
  backgroundColor = colors.page,
  children,
  padded = true,
  scroll = true
}: ScreenProps) {
  const contentClassName = cn("flex-grow", padded && "p-5");

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor }}>
      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName={contentClassName}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View className={contentClassName}>{children}</View>
      )}
    </SafeAreaView>
  );
}
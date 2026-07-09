import { useCallback, useState, type PropsWithChildren } from "react";
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

import { colors } from "@/theme/colors";
import { cn } from "@/utils/cn";

type ScreenProps = PropsWithChildren<{
  backgroundColor?: string;
  onRefresh?: () => Promise<void> | void;
  padded?: boolean;
  refreshable?: boolean;
  scroll?: boolean;
}>;

export function Screen({
  backgroundColor = colors.page,
  children,
  onRefresh,
  padded = true,
  refreshable = true,
  scroll = true
}: ScreenProps) {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const contentClassName = cn("flex-grow", padded && "p-5");
  const canRefresh = scroll && refreshable;

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      if (onRefresh) {
        await onRefresh();
      } else {
        await queryClient.invalidateQueries();
      }
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh, queryClient]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {scroll ? (
          <ScrollView
            className="flex-1"
            contentContainerClassName={contentClassName}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            refreshControl={
              canRefresh ? (
                <RefreshControl
                  colors={[colors.primary]}
                  progressBackgroundColor={colors.surface}
                  refreshing={refreshing}
                  tintColor={colors.primary}
                  titleColor={colors.muted}
                  onRefresh={handleRefresh}
                />
              ) : undefined
            }
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View className={contentClassName}>{children}</View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import type { PropsWithChildren } from "react";
import { Pressable, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";

import { colors } from "@/theme/colors";

import { Button } from "../../ui/action/button/Button";
import { Header } from "../header/Header";
import { Screen } from "../screen/Screen";
import { AppText } from "../typography/AppText";

type FormScreenProps = PropsWithChildren<{
  actionDisabled?: boolean;
  actionLabel: string;
  onAction: () => void;
  onBack?: () => void;
  title: string;
}>;

export function FormScreen({
  actionDisabled = false,
  actionLabel,
  children,
  onAction,
  onBack,
  title
}: FormScreenProps) {
  return (
    <Screen backgroundColor={colors.surface}>
      {onBack ? (
        <View className="mb-3 h-8 items-center justify-center">
          <Pressable
            accessibilityRole="button"
            className="absolute left-0 h-8 w-8 items-center justify-center"
            onPress={onBack}
          >
            <ChevronLeft color={colors.text} size={26} strokeWidth={2.2} />
          </Pressable>
          <AppText center color={colors.text} variant="subtitle">
            {title}
          </AppText>
        </View>
      ) : (
        <Header title={title} />
      )}

      <View className="gap-4">{children}</View>
      <View className="mt-8 pt-2">
        <Button disabled={actionDisabled} label={actionLabel} onPress={onAction} />
      </View>
    </Screen>
  );
}
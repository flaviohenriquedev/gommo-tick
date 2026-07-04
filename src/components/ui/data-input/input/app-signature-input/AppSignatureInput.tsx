import { useMemo, useState } from "react";
import { PanResponder, Pressable, View } from "react-native";
import Svg, { Polyline } from "react-native-svg";

import { AppText } from "@/components/system/typography/AppText";
import { colors } from "@/theme/colors";

import { FieldShell, type PickerInputProps } from "../shared/InputPrimitives";

export function AppSignatureInput({ onChange, value = [], ...props }: PickerInputProps & { onChange?: (points: string[]) => void; value?: string[] }) {
  const [points, setPoints] = useState<string[]>(value);
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (event) => {
          const nextPoint = `${Math.round(event.nativeEvent.locationX)},${Math.round(event.nativeEvent.locationY)}`;
          setPoints((current) => {
            const next = [...current, nextPoint];
            onChange?.(next);
            return next;
          });
        }
      }),
    [onChange]
  );

  return (
    <FieldShell {...props}>
      <View className="h-40 overflow-hidden rounded-button border border-border bg-surface" {...panResponder.panHandlers}>
        <Svg height="100%" width="100%">
          <Polyline fill="none" points={points.join(" ")} stroke={colors.primary} strokeWidth="3" />
        </Svg>
      </View>
      <Pressable className="self-start rounded-full bg-primarySoft px-3 py-2" onPress={() => setPoints([])}>
        <AppText color={colors.primary} variant="label">
          Limpar assinatura
        </AppText>
      </Pressable>
    </FieldShell>
  );
}
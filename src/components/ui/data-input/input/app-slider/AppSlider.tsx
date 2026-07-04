import { useMemo } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { AppText } from "@/components/system/typography/AppText";
import { colors } from "@/theme/colors";
import { cn } from "@/utils/cn";

import { FieldShell, type PickerInputProps } from "../shared/InputPrimitives";

export function AppSlider({
  max = 100,
  min = 0,
  onChange,
  step = 1,
  value = min,
  ...props
}: PickerInputProps & { max?: number; min?: number; onChange?: (value: number) => void; step?: number; value?: number }) {
  const options = useMemo(() => {
    const values: number[] = [];
    for (let next = min; next <= max; next += step) values.push(next);
    return values.slice(0, 101);
  }, [max, min, step]);
  const percent = max === min ? 0 : ((value - min) / (max - min)) * 100;

  return (
    <FieldShell {...props}>
      <View className="gap-3">
        <View className="h-3 overflow-hidden rounded-full bg-[#f0edf5]">
          <View className="h-full rounded-full bg-primary" style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {options.map((option) => (
              <Pressable className={cn("rounded-full border px-3 py-2", option === value ? "border-primary bg-primary" : "border-border bg-surface")} key={option} onPress={() => onChange?.(option)}>
                <AppText color={option === value ? colors.surface : colors.text} variant="label">
                  {option}
                </AppText>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    </FieldShell>
  );
}
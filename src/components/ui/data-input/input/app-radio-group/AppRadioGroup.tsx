import { Pressable, View } from "react-native";

import { AppText } from "@/components/system/typography/AppText";
import { cn } from "@/utils/cn";

import { FieldShell, type OptionInputProps } from "../shared/InputPrimitives";

export function AppRadioGroup({ onChange, options, value, ...props }: OptionInputProps) {
  return (
    <FieldShell {...props}>
      <View className="gap-3">
        {options.map((option) => {
          const selected = option.value === value;

          return (
            <Pressable className="flex-row items-center gap-3" disabled={option.disabled} key={option.value} onPress={() => onChange?.(option.value)}>
              <View className={cn("h-6 w-6 items-center justify-center rounded-full border", selected ? "border-primary" : "border-border")}>
                {selected ? <View className="h-3 w-3 rounded-full bg-primary" /> : null}
              </View>
              <AppText className={option.disabled ? "opacity-50" : undefined}>{option.label}</AppText>
            </Pressable>
          );
        })}
      </View>
    </FieldShell>
  );
}
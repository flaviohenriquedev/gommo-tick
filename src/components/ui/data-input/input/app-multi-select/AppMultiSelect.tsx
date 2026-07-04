import { useState } from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { Check, ChevronDown, X } from "lucide-react-native";

import { AppText } from "@/components/system/typography/AppText";
import { colors } from "@/theme/colors";
import { cn } from "@/utils/cn";

import { ReadonlyInput, type OptionInputProps } from "../shared/InputPrimitives";

export function AppMultiSelect({
  onChange,
  options,
  placeholder = "Selecionar",
  value = [],
  ...props
}: Omit<OptionInputProps, "onChange" | "value"> & { onChange?: (value: string[]) => void; value?: string[] }) {
  const [isVisible, setVisible] = useState(false);
  const displayValue = options.filter((option) => value.includes(option.value)).map((option) => option.label).join(", ");

  const toggleValue = (nextValue: string) => {
    const nextValues = value.includes(nextValue) ? value.filter((item) => item !== nextValue) : [...value, nextValue];
    onChange?.(nextValues);
  };

  return (
    <>
      <ReadonlyInput
        {...props}
        icon={<ChevronDown color={colors.primary} size={20} />}
        onPress={() => setVisible(true)}
        placeholder={placeholder}
        value={displayValue}
      />
      <Modal animationType="fade" transparent visible={isVisible}>
        <View className="flex-1 justify-end bg-[rgba(23,19,33,0.44)]">
          <Pressable className="absolute inset-0" onPress={() => setVisible(false)} />
          <View className="max-h-[70%] rounded-t-sheet bg-surface p-5">
            <View className="mb-3 flex-row items-center justify-between">
              <AppText className="font-inter-extrabold">Selecionar opções</AppText>
              <Pressable className="h-9 w-9 items-center justify-center rounded-[18px] bg-primarySoft" onPress={() => setVisible(false)}>
                <X color={colors.text} size={20} />
              </Pressable>
            </View>
            <ScrollView>
              {options.map((option) => {
                const selected = value.includes(option.value);

                return (
                  <Pressable className="flex-row items-center justify-between border-b border-[#f2eff7] py-4" disabled={option.disabled} key={option.value} onPress={() => toggleValue(option.value)}>
                    <AppText className={option.disabled ? "opacity-50" : undefined}>{option.label}</AppText>
                    <View className={cn("h-6 w-6 items-center justify-center rounded-md border", selected ? "border-primary bg-primary" : "border-border")}>
                      {selected ? <Check color={colors.surface} size={16} /> : null}
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
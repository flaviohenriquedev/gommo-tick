import { Modal, Pressable, ScrollView, View } from "react-native";
import { useState } from "react";
import { ChevronDown, X } from "lucide-react-native";

import { AppText } from "@/components/system/typography/AppText";
import { colors } from "@/theme/colors";

import { ReadonlyInput, selectedLabel, type OptionInputProps, type AppSelectOption } from "../shared/InputPrimitives";

function OptionsModal({ onClose, onSelect, options, visible }: { onClose: () => void; onSelect?: (value: string) => void; options: AppSelectOption[]; visible: boolean }) {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View className="flex-1 justify-end bg-[rgba(23,19,33,0.44)]">
        <Pressable className="absolute inset-0" onPress={onClose} />
        <View className="max-h-[70%] rounded-t-sheet bg-surface p-5">
          <View className="mb-3 flex-row items-center justify-between">
            <AppText className="font-inter-extrabold">Selecionar</AppText>
            <Pressable className="h-9 w-9 items-center justify-center rounded-[18px] bg-primarySoft" onPress={onClose}>
              <X color={colors.text} size={20} />
            </Pressable>
          </View>
          <ScrollView>
            {options.map((option) => (
              <Pressable
                className="border-b border-[#f2eff7] py-4"
                disabled={option.disabled}
                key={option.value}
                onPress={() => {
                  onSelect?.(option.value);
                  onClose();
                }}
              >
                <AppText className={option.disabled ? "opacity-50" : undefined}>{option.label}</AppText>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export function AppSelect({ onChange, options, placeholder = "Selecionar", value, ...props }: OptionInputProps) {
  const [isVisible, setVisible] = useState(false);

  return (
    <>
      <ReadonlyInput
        {...props}
        icon={<ChevronDown color={colors.primary} size={20} />}
        onPress={() => setVisible(true)}
        placeholder={placeholder}
        value={selectedLabel(options, value)}
      />
      <OptionsModal onClose={() => setVisible(false)} onSelect={onChange} options={options} visible={isVisible} />
    </>
  );
}

export type { AppSelectOption };
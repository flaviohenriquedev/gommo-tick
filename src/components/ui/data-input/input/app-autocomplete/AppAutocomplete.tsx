import { useState } from "react";
import { Pressable, View } from "react-native";
import { Search } from "lucide-react-native";

import { AppText } from "@/components/system/typography/AppText";
import { colors } from "@/theme/colors";

import { AppBaseInput } from "../AppBaseInput";
import { selectedLabel, type OptionInputProps } from "../shared/InputPrimitives";

export function AppAutocomplete({ onChange, options, placeholder = "Pesquisar", value, ...props }: OptionInputProps) {
  const [query, setQuery] = useState(selectedLabel(options, value));
  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <View className="gap-2">
      <AppBaseInput {...props} leftElement={<Search color={colors.muted} size={20} />} onChangeText={setQuery} placeholder={placeholder} value={query} />
      {query ? (
        <View className="overflow-hidden rounded-button border border-border bg-surface">
          {filteredOptions.slice(0, 6).map((option) => (
            <Pressable
              className="border-b border-[#f2eff7] px-4 py-3"
              disabled={option.disabled}
              key={option.value}
              onPress={() => {
                setQuery(option.label);
                onChange?.(option.value);
              }}
            >
              <AppText className={option.disabled ? "opacity-50" : undefined}>{option.label}</AppText>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
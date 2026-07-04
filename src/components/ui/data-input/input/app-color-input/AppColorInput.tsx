import { Pressable, View } from "react-native";
import { Check } from "lucide-react-native";

import { colors } from "@/theme/colors";

import { FieldShell, type PickerInputProps } from "../shared/InputPrimitives";

const colorOptions = ["#6d28d9", "#2563eb", "#16a34a", "#d97706", "#dc2626", "#171321", "#6b6478", "#ffffff"];

export function AppColorInput({ onChange, value, ...props }: PickerInputProps & { onChange?: (value: string) => void; value?: string }) {
  return (
    <FieldShell {...props}>
      <View className="flex-row flex-wrap gap-3">
        {colorOptions.map((color) => (
          <Pressable className="h-10 w-10 items-center justify-center rounded-full border border-border" key={color} onPress={() => onChange?.(color)} style={{ backgroundColor: color }}>
            {value === color ? <Check color={color === "#ffffff" ? colors.text : colors.surface} size={18} /> : null}
          </Pressable>
        ))}
      </View>
    </FieldShell>
  );
}
import { Pressable, View } from "react-native";
import { Star } from "lucide-react-native";

import { colors } from "@/theme/colors";

import { FieldShell, type PickerInputProps } from "../shared/InputPrimitives";

export function AppRating({ max = 5, onChange, value = 0, ...props }: PickerInputProps & { max?: number; onChange?: (value: number) => void; value?: number }) {
  return (
    <FieldShell {...props}>
      <View className="flex-row gap-2">
        {Array.from({ length: max }, (_, index) => index + 1).map((rating) => (
          <Pressable key={rating} onPress={() => onChange?.(rating)}>
            <Star color={rating <= value ? colors.warning : colors.muted} fill={rating <= value ? colors.warning : "transparent"} size={28} />
          </Pressable>
        ))}
      </View>
    </FieldShell>
  );
}
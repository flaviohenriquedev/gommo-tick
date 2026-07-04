import { Clock3 } from "lucide-react-native";

import { colors } from "@/theme/colors";

import { maskTime } from "../inputMasks";
import { AppBaseInput } from "../AppBaseInput";
import { applyMask, type MaskedInputProps } from "../shared/InputPrimitives";

export function AppTimeInput({ onChangeText, ...props }: MaskedInputProps) {
  return (
    <AppBaseInput
      {...props}
      keyboardType="numeric"
      leftElement={<Clock3 color={colors.primary} size={20} />}
      onChangeText={applyMask(maskTime, onChangeText)}
      placeholder={props.placeholder ?? "HH:mm"}
    />
  );
}
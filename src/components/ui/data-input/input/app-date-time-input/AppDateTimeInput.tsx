import { CalendarDays } from "lucide-react-native";

import { colors } from "@/theme/colors";

import { AppBaseInput } from "../AppBaseInput";
import { maskDateTime } from "../inputMasks";
import { applyMask, type MaskedInputProps } from "../shared/InputPrimitives";

export function AppDateTimeInput({ onChangeText, ...props }: MaskedInputProps) {
  return (
    <AppBaseInput
      {...props}
      keyboardType="numeric"
      leftElement={<CalendarDays color={colors.primary} size={20} />}
      onChangeText={applyMask(maskDateTime, onChangeText)}
      placeholder={props.placeholder ?? "dd/mm/aaaa hh:mm"}
    />
  );
}
import { MapPin } from "lucide-react-native";

import { colors } from "@/theme/colors";

import { ReadonlyInput, type PickerInputProps } from "../shared/InputPrimitives";

export function AppLocationInput({ onRequestLocation, value, ...props }: PickerInputProps & { onRequestLocation?: () => void; value?: string }) {
  return <ReadonlyInput {...props} icon={<MapPin color={colors.primary} size={20} />} onPress={() => onRequestLocation?.()} placeholder={props.placeholder ?? "Capturar localização"} value={value} />;
}
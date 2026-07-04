import { Barcode } from "lucide-react-native";

import { colors } from "@/theme/colors";

import { ActionInput } from "../shared/ActionInput";
import type { PickerInputProps } from "../shared/InputPrimitives";

export function AppBarcodeInput(props: PickerInputProps & { onScan?: () => void }) {
  return <ActionInput {...props} icon={<Barcode color={colors.primary} size={20} />} onPress={props.onScan} title={props.placeholder ?? "Escanear código de barras"} />;
}
import { QrCode } from "lucide-react-native";

import { colors } from "@/theme/colors";

import { ActionInput } from "../shared/ActionInput";
import type { PickerInputProps } from "../shared/InputPrimitives";

export function AppQrCodeInput(props: PickerInputProps & { onScan?: () => void }) {
  return <ActionInput {...props} icon={<QrCode color={colors.primary} size={20} />} onPress={props.onScan} title={props.placeholder ?? "Escanear QR Code"} />;
}
import { Fingerprint } from "lucide-react-native";

import { colors } from "@/theme/colors";

import { ActionInput } from "../shared/ActionInput";
import type { PickerInputProps } from "../shared/InputPrimitives";

export function AppBiometricInput(props: PickerInputProps & { onAuthenticate?: () => void }) {
  return <ActionInput {...props} icon={<Fingerprint color={colors.primary} size={20} />} onPress={props.onAuthenticate} title={props.placeholder ?? "Autenticar com biometria"} />;
}
import { AppMaskedInput, type MaskedInputProps } from "../shared/InputPrimitives";
import { maskCpf } from "../inputMasks";

export function AppCpfInput(props: MaskedInputProps) {
  return <AppMaskedInput {...props} keyboardType="numeric" mask={maskCpf} />;
}
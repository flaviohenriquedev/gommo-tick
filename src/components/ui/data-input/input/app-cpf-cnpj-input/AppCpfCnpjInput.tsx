import { AppMaskedInput, type MaskedInputProps } from "../shared/InputPrimitives";
import { maskCpfCnpj } from "../inputMasks";

export function AppCpfCnpjInput(props: MaskedInputProps) {
  return <AppMaskedInput {...props} keyboardType="numeric" mask={maskCpfCnpj} />;
}
import { AppMaskedInput, type MaskedInputProps } from "../shared/InputPrimitives";
import { maskCnpj } from "../inputMasks";

export function AppCnpjInput(props: MaskedInputProps) {
  return <AppMaskedInput {...props} keyboardType="numeric" mask={maskCnpj} />;
}
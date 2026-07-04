import { AppMaskedInput, type MaskedInputProps } from "../shared/InputPrimitives";
import { maskCep } from "../inputMasks";

export function AppCepInput(props: MaskedInputProps) {
  return <AppMaskedInput {...props} keyboardType="numeric" mask={maskCep} />;
}
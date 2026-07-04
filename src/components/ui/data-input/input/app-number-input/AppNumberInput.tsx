import { AppMaskedInput, type MaskedInputProps } from "../shared/InputPrimitives";
import { maskInteger } from "../inputMasks";

export function AppNumberInput(props: MaskedInputProps) {
  return <AppMaskedInput {...props} keyboardType="numeric" mask={maskInteger} />;
}
import { AppMaskedInput, type MaskedInputProps } from "../shared/InputPrimitives";
import { maskDecimal } from "../inputMasks";

export function AppDecimalInput(props: MaskedInputProps) {
  return <AppMaskedInput {...props} keyboardType="decimal-pad" mask={maskDecimal} />;
}
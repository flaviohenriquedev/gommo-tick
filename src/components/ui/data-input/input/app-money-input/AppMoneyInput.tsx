import { AppMaskedInput, type MaskedInputProps } from "../shared/InputPrimitives";
import { maskMoney } from "../inputMasks";

export function AppMoneyInput(props: MaskedInputProps) {
  return <AppMaskedInput {...props} keyboardType="decimal-pad" mask={maskMoney} />;
}
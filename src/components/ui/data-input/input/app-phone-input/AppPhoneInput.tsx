import { AppMaskedInput, type MaskedInputProps } from "../shared/InputPrimitives";
import { maskPhone } from "../inputMasks";

export function AppPhoneInput(props: MaskedInputProps) {
  return <AppMaskedInput {...props} keyboardType="phone-pad" mask={maskPhone} />;
}
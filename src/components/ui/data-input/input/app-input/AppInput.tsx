import { AppBaseInput } from "../AppBaseInput";
import type { AppBaseInputProps } from "../shared/InputPrimitives";

export function AppInput(props: AppBaseInputProps) {
  return <AppBaseInput {...props} keyboardType="default" />;
}
import { AppBaseInput } from "../AppBaseInput";
import type { AppBaseInputProps } from "../shared/InputPrimitives";

export function AppEmailInput(props: AppBaseInputProps) {
  return <AppBaseInput {...props} autoCapitalize="none" keyboardType="email-address" textContentType="emailAddress" />;
}
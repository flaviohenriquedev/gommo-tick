import { AppBaseInput } from "../AppBaseInput";
import type { AppBaseInputProps } from "../shared/InputPrimitives";

export function AppUrlInput(props: AppBaseInputProps) {
  return <AppBaseInput {...props} autoCapitalize="none" keyboardType="url" textContentType="URL" />;
}
import { AppBaseInput } from "../AppBaseInput";
import type { AppBaseInputProps } from "../shared/InputPrimitives";

export function AppTextarea(props: AppBaseInputProps) {
  return <AppBaseInput {...props} multiline />;
}
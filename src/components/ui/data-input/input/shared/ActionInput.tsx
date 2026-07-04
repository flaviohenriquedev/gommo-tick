import type { ReactNode } from "react";

import { ReadonlyInput, type PickerInputProps } from "./InputPrimitives";

export function ActionInput({ icon, onPress, title, ...props }: PickerInputProps & { icon: ReactNode; onPress?: () => void; title: string }) {
  return <ReadonlyInput {...props} icon={icon} onPress={() => onPress?.()} placeholder={title} value="" />;
}
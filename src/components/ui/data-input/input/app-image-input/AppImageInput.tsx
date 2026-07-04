import { AppFileInput, type AppFileInputProps } from "../app-file-input/AppFileInput";

export function AppImageInput(props: Omit<AppFileInputProps, "accept">) {
  return <AppFileInput {...props} accept="image/*" placeholder={props.placeholder ?? "Selecionar imagem"} />;
}
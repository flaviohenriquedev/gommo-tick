import { Search } from "lucide-react-native";

import { colors } from "@/theme/colors";

import { AppBaseInput } from "../AppBaseInput";
import type { AppBaseInputProps } from "../shared/InputPrimitives";

export function AppSearchInput(props: AppBaseInputProps) {
  return <AppBaseInput {...props} leftElement={<Search color={colors.muted} size={20} />} returnKeyType="search" />;
}
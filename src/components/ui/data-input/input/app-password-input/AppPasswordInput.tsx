import { useState } from "react";
import { Pressable } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

import { colors } from "@/theme/colors";

import { AppBaseInput } from "../AppBaseInput";
import type { AppBaseInputProps } from "../shared/InputPrimitives";

export function AppPasswordInput(props: AppBaseInputProps) {
  const [isVisible, setVisible] = useState(false);

  return (
    <AppBaseInput
      {...props}
      autoCapitalize="none"
      rightElement={
        <Pressable accessibilityRole="button" onPress={() => setVisible((current) => !current)}>
          {isVisible ? <EyeOff color={colors.muted} size={20} /> : <Eye color={colors.muted} size={20} />}
        </Pressable>
      }
      secureTextEntry={!isVisible}
    />
  );
}
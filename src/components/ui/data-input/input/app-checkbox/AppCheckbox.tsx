import { Pressable, View } from "react-native";
import { Check } from "lucide-react-native";

import { AppText } from "@/components/system/typography/AppText";
import { colors } from "@/theme/colors";
import { cn } from "@/utils/cn";

export function AppCheckbox({ label, onChange, value = false }: { label?: string; onChange?: (value: boolean) => void; value?: boolean }) {
  return (
    <Pressable className="flex-row items-center gap-3" onPress={() => onChange?.(!value)}>
      <View className={cn("h-6 w-6 items-center justify-center rounded-md border", value ? "border-primary bg-primary" : "border-border bg-surface")}>
        {value ? <Check color={colors.surface} size={16} /> : null}
      </View>
      {label ? <AppText>{label}</AppText> : null}
    </Pressable>
  );
}
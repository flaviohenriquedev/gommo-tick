import { Switch as NativeSwitch, View } from "react-native";

import { AppText } from "@/components/system/typography/AppText";
import { colors } from "@/theme/colors";

export function AppSwitch({ label, onChange, value = false }: { label?: string; onChange?: (value: boolean) => void; value?: boolean }) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      {label ? <AppText className="flex-1">{label}</AppText> : null}
      <NativeSwitch onValueChange={onChange} thumbColor={colors.surface} trackColor={{ false: "#ded7ea", true: colors.primary }} value={value} />
    </View>
  );
}
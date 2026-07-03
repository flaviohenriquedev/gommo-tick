import { Pressable, StyleSheet, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";

import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

import { AppText } from "./AppText";

type HeaderProps = {
  title: string;
  canGoBack?: boolean;
};

export function Header({ title, canGoBack = true }: HeaderProps) {
  return (
    <View style={styles.header}>
      {canGoBack ? (
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.back}>
          <ChevronLeft color={colors.text} size={26} strokeWidth={2.2} />
        </Pressable>
      ) : null}
      <AppText variant="subtitle" color={colors.text} center>
        {title}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    height: 32,
    justifyContent: "center",
    marginBottom: spacing[6]
  },
  back: {
    alignItems: "center",
    height: 32,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    width: 32
  }
});

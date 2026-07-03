import { Pressable, StyleSheet, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { router } from "expo-router";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { profileItems } from "@/data/mock";
import { useAuthStore } from "@/store/authStore";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { spacing } from "@/theme/spacing";

export function ProfileScreen() {
  const signOut = useAuthStore((state) => state.signOut);

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/login");
  };

  return (
    <Screen padded={false} backgroundColor={colors.surface}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <AppText style={styles.avatarText}>FH</AppText>
        </View>
        <AppText color={colors.surface} style={styles.name}>
          Flavio Henrique
        </AppText>
        <AppText color="rgba(255,255,255,0.78)" variant="label">
          Desenvolvedor
        </AppText>
      </View>

      <View style={styles.content}>
        <Card style={styles.card}>
          {profileItems.map(({ label, value, icon: Icon }) => (
            <Pressable key={label} style={styles.row}>
              <View style={styles.rowLabel}>
                <Icon color={colors.primary} size={20} />
                <AppText>{label}</AppText>
              </View>
              <View style={styles.rowValue}>
                {value ? <AppText variant="label">{value}</AppText> : null}
                <ChevronRight color={colors.muted} size={18} />
              </View>
            </Pressable>
          ))}
        </Card>

        <Button label="Sair da Conta" onPress={handleSignOut} variant="danger" style={styles.signOut} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderBottomLeftRadius: radius.sheet,
    borderBottomRightRadius: radius.sheet,
    paddingBottom: spacing[8],
    paddingTop: spacing[10]
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#e7ddff",
    borderColor: colors.surface,
    borderRadius: 44,
    borderWidth: 4,
    height: 88,
    justifyContent: "center",
    width: 88
  },
  avatarText: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "900"
  },
  name: {
    fontSize: 20,
    fontWeight: "900",
    marginTop: spacing[3]
  },
  content: {
    flex: 1,
    padding: spacing[5]
  },
  card: {
    marginTop: -spacing[10],
    paddingVertical: spacing[2]
  },
  row: {
    alignItems: "center",
    borderBottomColor: "#f2eff7",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing[4]
  },
  rowLabel: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[3]
  },
  rowValue: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[1]
  },
  signOut: {
    marginTop: "auto"
  }
});

import { StyleSheet, TextInput, View } from "react-native";
import { Eye, Fingerprint } from "lucide-react-native";
import { router } from "expo-router";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { useAuthStore } from "@/store/authStore";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { spacing } from "@/theme/spacing";

const loginSchema = z.object({
  identifier: z.string().min(3, "Informe seu e-mail ou CPF"),
  password: z.string().min(6, "Informe sua senha")
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginScreen() {
  const signIn = useAuthStore((state) => state.signIn);
  const { control, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "seu@email.com",
      password: "123456"
    }
  });

  const onSubmit = () => {
    signIn();
    router.replace("/(tabs)");
  };

  return (
    <Screen scroll={false} backgroundColor={colors.surface}>
      <View style={styles.container}>
        <View style={styles.brand}>
          <AppText style={styles.logo}>gommo</AppText>
          <AppText style={styles.logoAccent}>tick</AppText>
        </View>

        <View style={styles.copy}>
          <AppText variant="title" center>
            Bem-vindo(a)!
          </AppText>
          <AppText variant="subtitle" center>
            Acesse sua conta para continuar
          </AppText>
        </View>

        <View style={styles.form}>
          <AppText variant="label" color={colors.text}>
            E-mail ou CPF
          </AppText>
          <Controller
            control={control}
            name="identifier"
            render={({ field: { onChange, value } }) => (
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={onChange}
                placeholder="seu@email.com"
                placeholderTextColor="#9b94aa"
                style={styles.input}
                value={value}
              />
            )}
          />

          <AppText variant="label" color={colors.text} style={styles.passwordLabel}>
            Senha
          </AppText>
          <View style={styles.passwordField}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  onChangeText={onChange}
                  placeholder="Sua senha"
                  placeholderTextColor="#9b94aa"
                  secureTextEntry
                  style={styles.passwordInput}
                  value={value}
                />
              )}
            />
            <Eye color={colors.muted} size={20} />
          </View>

          <AppText variant="label" color={colors.primary} style={styles.forgot}>
            Esqueceu sua senha?
          </AppText>

          <Button label="Entrar" onPress={handleSubmit(onSubmit)} />

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <AppText variant="label">ou</AppText>
            <View style={styles.divider} />
          </View>

          <Button label="Entrar com biometria" onPress={onSubmit} variant="secondary" />
          <View style={styles.biometryIcon}>
            <Fingerprint color={colors.primary} size={20} />
          </View>
        </View>

        <AppText variant="label" center style={styles.footer}>
          Nao tem uma conta? <AppText color={colors.primary}>Fale com seu RH</AppText>
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: spacing[6]
  },
  brand: {
    alignItems: "center",
    marginBottom: spacing[10]
  },
  logo: {
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: -1.2,
    lineHeight: 38
  },
  logoAccent: {
    color: colors.primary,
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: -1.2,
    lineHeight: 38
  },
  copy: {
    gap: spacing[2],
    marginBottom: spacing[10]
  },
  form: {
    gap: spacing[2]
  },
  input: {
    borderColor: colors.border,
    borderRadius: radius.input,
    borderWidth: 1,
    color: colors.text,
    fontSize: 15,
    height: 52,
    paddingHorizontal: spacing[4]
  },
  passwordLabel: {
    marginTop: spacing[3]
  },
  passwordField: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: radius.input,
    borderWidth: 1,
    flexDirection: "row",
    height: 52,
    paddingHorizontal: spacing[4]
  },
  passwordInput: {
    color: colors.text,
    flex: 1,
    fontSize: 15
  },
  forgot: {
    alignSelf: "flex-end",
    marginBottom: spacing[3],
    marginTop: spacing[1]
  },
  dividerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[3],
    marginVertical: spacing[3]
  },
  divider: {
    backgroundColor: "#edeaf3",
    flex: 1,
    height: StyleSheet.hairlineWidth
  },
  biometryIcon: {
    alignItems: "center",
    height: 0,
    justifyContent: "center",
    left: spacing[6],
    top: -36,
    width: 24
  },
  footer: {
    marginTop: "auto"
  }
});

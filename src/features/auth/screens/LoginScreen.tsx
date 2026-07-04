import { View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Fingerprint } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Screen } from "@/components/system/screen/Screen";
import { AppText } from "@/components/system/typography/AppText";
import { Button } from "@/components/ui/action/button/Button";
import { AppEmailInput, AppPasswordInput } from "@/components/ui/data-input/input";
import { useAuthStore } from "@/store/authStore";
import { colors } from "@/theme/colors";

const loginSchema = z.object({
  identifier: z.string().min(3, "Informe seu e-mail ou CPF"),
  password: z.string().min(6, "Informe sua senha")
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginScreen() {
  const signIn = useAuthStore((state) => state.signIn);
  const { control, handleSubmit } = useForm<LoginForm>({
    defaultValues: {
      identifier: "seu@email.com",
      password: "123456"
    },
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = () => {
    signIn();
    router.replace("/(tabs)");
  };

  return (
    <Screen backgroundColor={colors.surface} scroll={false}>
      <View className="flex-1 justify-center py-6">
        <View className="mb-10 items-center">
          <AppText className="font-inter-extrabold text-4xl leading-[38px] tracking-[-1.2px]">gommo</AppText>
          <AppText className="font-inter-extrabold text-4xl leading-[38px] tracking-[-1.2px] text-primary">
            tick
          </AppText>
        </View>

        <View className="mb-10 gap-2">
          <AppText center variant="title">
            Bem-vindo(a)!
          </AppText>
          <AppText center variant="subtitle">
            Acesse sua conta para continuar
          </AppText>
        </View>

        <View className="gap-2">
          <Controller
            control={control}
            name="identifier"
            render={({ field: { onChange, value } }) => (
              <AppEmailInput label="E-mail ou CPF" onChangeText={onChange} placeholder="seu@email.com" value={value} />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <AppPasswordInput containerClassName="mt-3" label="Senha" onChangeText={onChange} placeholder="Sua senha" value={value} />
            )}
          />

          <AppText className="mb-3 mt-1 self-end" color={colors.primary} variant="label">
            Esqueceu sua senha?
          </AppText>

          <Button label="Entrar" onPress={handleSubmit(onSubmit)} />

          <View className="my-3 flex-row items-center gap-3">
            <View className="h-px flex-1 bg-[#edeaf3]" />
            <AppText variant="label">ou</AppText>
            <View className="h-px flex-1 bg-[#edeaf3]" />
          </View>

          <Button label="Entrar com biometria" onPress={onSubmit} variant="secondary" />
          <View className="left-6 top-[-36px] h-0 w-6 items-center justify-center">
            <Fingerprint color={colors.primary} size={20} />
          </View>
        </View>

        <AppText center className="mt-auto" variant="label">
          Não tem uma conta? <AppText color={colors.primary}>Fale com seu RH</AppText>
        </AppText>
      </View>
    </Screen>
  );
}
import { useState } from "react";
import { View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { router } from "expo-router";
import { Fingerprint } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Screen } from "@/components/system/screen/Screen";
import { AppText } from "@/components/system/typography/AppText";
import { Button } from "@/components/ui/action/button/Button";
import { AppEmailInput, AppInput, AppPasswordInput } from "@/components/ui/data-input/input";
import { login } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { colors } from "@/theme/colors";

const loginSchema = z.object({
    companyCode: z.string().min(6, "Informe o código da empresa"),
    identifier: z.string().min(3, "Informe seu e-mail ou CPF"),
    password: z.string().min(6, "Informe sua senha")
});

type LoginForm = z.infer<typeof loginSchema>;

const defaultCompanyCode = __DEV__ ? (process.env.EXPO_PUBLIC_DEV_COMPANY_CODE ?? "000000000") : "";

type ApiErrorPayload = {
    detail?: string;
    error?: string;
    message?: string;
    title?: string;
};

function getLoginErrorMessage(error: unknown) {
    if (isAxiosError<ApiErrorPayload>(error)) {
        const data = error.response?.data;
        return (
            data?.message ??
            data?.detail ??
            data?.error ??
            data?.title ??
            "Não foi possível entrar. Confira seus dados."
        );
    }

    return "Não foi possível entrar. Confira seus dados.";
}

export function LoginScreen() {
    const signIn = useAuthStore((state) => state.signIn);
    const [submissionError, setSubmissionError] = useState("");
    const [isSubmitting, setSubmitting] = useState(false);
    const { control, handleSubmit } = useForm<LoginForm>({
        defaultValues: {
            companyCode: defaultCompanyCode,
            identifier: "",
            password: ""
        },
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (form: LoginForm) => {
        setSubmissionError("");
        setSubmitting(true);

        try {
            const session = await login({
                companyCode: form.companyCode,
                username: form.identifier,
                password: form.password
            });
            signIn({ employeeName: session.username, tenantSlug: session.tenantSlug });
            router.replace("/(tabs)");
        } catch (error) {
            setSubmissionError(getLoginErrorMessage(error));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Screen backgroundColor={colors.surface} scroll={false}>
            <View className="flex-1 justify-center py-6">
                <View className="mb-10 items-center">
                    <AppText className="font-inter-extrabold text-4xl leading-[38px] tracking-[-1.2px]">
                        gommo
                    </AppText>
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
                        name="companyCode"
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <AppInput
                                autoCapitalize="characters"
                                error={error?.message}
                                keyboardType="number-pad"
                                label="Código da empresa"
                                onChangeText={onChange}
                                placeholder="Ex.: 123456789"
                                value={value}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="identifier"
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <AppEmailInput
                                containerClassName="mt-3"
                                error={error?.message}
                                label="E-mail ou CPF"
                                onChangeText={onChange}
                                placeholder="seu@email.com"
                                value={value}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <AppPasswordInput
                                containerClassName="mt-3"
                                error={error?.message}
                                label="Senha"
                                onChangeText={onChange}
                                placeholder="Sua senha"
                                value={value}
                            />
                        )}
                    />

                    <AppText className="mb-3 mt-1 self-end" color={colors.primary} variant="label">
                        Esqueceu sua senha?
                    </AppText>

                    {submissionError ? (
                        <AppText className="mb-2 font-inter-semibold text-xs" color={colors.error}>
                            {submissionError}
                        </AppText>
                    ) : null}

                    <Button
                        disabled={isSubmitting}
                        label={isSubmitting ? "Entrando..." : "Entrar"}
                        onPress={handleSubmit(onSubmit)}
                    />

                    <View className="my-3 flex-row items-center gap-3">
                        <View className="h-px flex-1 bg-[#edeaf3]" />
                        <AppText variant="label">ou</AppText>
                        <View className="h-px flex-1 bg-[#edeaf3]" />
                    </View>

                    <Button
                        disabled={isSubmitting}
                        label="Entrar com biometria"
                        onPress={handleSubmit(onSubmit)}
                        variant="secondary"
                    />
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

import { useMemo, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { Check, Clock3, Minus, Plus, X } from "lucide-react-native";

import { AppText } from "@/components/system/typography/AppText";
import { Button } from "@/components/ui/action/button/Button";
import { colors } from "@/theme/colors";

import { type MaskedInputProps, ReadonlyInput } from "../shared/InputPrimitives";

const clockSize = 292;
const clockCenter = clockSize / 2;
const hourRadius = 116;
const minuteRadius = 74;
const hours = Array.from({ length: 24 }, (_, index) => index);
const minuteSteps = Array.from({ length: 12 }, (_, index) => index * 5);

type ClockOptionProps = {
    isSelected: boolean;
    label: string;
    onPress: () => void;
    radius: number;
    total: number;
    value: number;
};

function parseTime(value?: string) {
    const match = /^(\d{1,2}):(\d{2})$/.exec(value?.trim() ?? "");
    if (!match) return { hour: 8, minute: 0 };

    const hour = Math.min(23, Math.max(0, Number(match[1])));
    const minute = Math.min(59, Math.max(0, Number(match[2])));
    return { hour, minute };
}

function formatTime(hour: number, minute: number) {
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function normalizeMinute(value: number) {
    if (value < 0) return 59;
    if (value > 59) return 0;
    return value;
}

function closestMinuteStep(value: number) {
    return Math.round(value / 5) * 5 % 60;
}

function ClockOption({ isSelected, label, onPress, radius, total, value }: ClockOptionProps) {
    const angle = (value / total) * Math.PI * 2 - Math.PI / 2;
    const size = radius === hourRadius ? 34 : 30;
    const left = clockCenter + Math.cos(angle) * radius - size / 2;
    const top = clockCenter + Math.sin(angle) * radius - size / 2;

    return (
        <Pressable
            accessibilityRole="button"
            className="absolute items-center justify-center rounded-[18px]"
            onPress={onPress}
            style={{
                backgroundColor: isSelected ? colors.primary : "transparent",
                height: size,
                left,
                top,
                width: size
            }}
        >
            <AppText
                className={isSelected ? "font-inter-extrabold text-xs" : "font-inter-semibold text-xs"}
                color={isSelected ? colors.surface : colors.text}
            >
                {label}
            </AppText>
        </Pressable>
    );
}

export function AppTimeInput({
    onChangeText,
    placeholder = "Selecionar horário",
    value,
    ...props
}: MaskedInputProps) {
    const parsedTime = useMemo(() => parseTime(String(value ?? "")), [value]);
    const [isVisible, setVisible] = useState(false);
    const [hour, setHour] = useState(parsedTime.hour);
    const [minute, setMinute] = useState(parsedTime.minute);

    const open = () => {
        setHour(parsedTime.hour);
        setMinute(parsedTime.minute);
        setVisible(true);
    };

    const close = () => setVisible(false);

    const confirm = () => {
        onChangeText?.(formatTime(hour, minute));
        close();
    };

    const selectMinuteStep = (nextMinute: number) => {
        setMinute(nextMinute);
    };

    return (
        <>
            <ReadonlyInput
                {...props}
                icon={<Clock3 color={colors.primary} size={20} />}
                onPress={open}
                placeholder={placeholder}
                value={String(value ?? "")}
            />

            <Modal animationType="fade" onRequestClose={close} transparent visible={isVisible}>
                <View className="flex-1 justify-end bg-[rgba(23,19,33,0.34)]">
                    <Pressable className="absolute inset-0" onPress={close} />
                    <View className="rounded-t-sheet border border-border bg-surface p-5 shadow-2xl">
                        <View className="mb-4 flex-row items-center justify-between">
                            <View>
                                <AppText className="font-inter-extrabold">Selecionar horário</AppText>
                                <AppText variant="label">Toque na hora e depois ajuste os minutos.</AppText>
                            </View>
                            <Pressable
                                accessibilityRole="button"
                                className="h-10 w-10 items-center justify-center rounded-[20px] bg-primarySoft"
                                onPress={close}
                            >
                                <X color={colors.text} size={20} />
                            </Pressable>
                        </View>

                        <View className="self-center rounded-[146px] bg-[#faf8ff]" style={{ height: clockSize, width: clockSize }}>
                            <View className="absolute left-[45px] top-[45px] h-[202px] w-[202px] rounded-[101px] border border-border bg-surface" />
                            <View className="absolute left-[92px] top-[92px] h-[108px] w-[108px] items-center justify-center rounded-[54px] bg-primarySoft">
                                <AppText className="font-inter-extrabold text-[30px] leading-9" color={colors.primary}>
                                    {formatTime(hour, minute)}
                                </AppText>
                                <View className="mt-2 flex-row items-center gap-3">
                                    <Pressable
                                        accessibilityRole="button"
                                        className="h-8 w-8 items-center justify-center rounded-[16px] bg-surface"
                                        onPress={() => setMinute((current) => normalizeMinute(current - 1))}
                                    >
                                        <Minus color={colors.primary} size={16} />
                                    </Pressable>
                                    <Pressable
                                        accessibilityRole="button"
                                        className="h-8 w-8 items-center justify-center rounded-[16px] bg-surface"
                                        onPress={() => setMinute((current) => normalizeMinute(current + 1))}
                                    >
                                        <Plus color={colors.primary} size={16} />
                                    </Pressable>
                                </View>
                            </View>

                            {hours.map((option) => (
                                <ClockOption
                                    isSelected={option === hour}
                                    key={`hour-${option}`}
                                    label={String(option).padStart(2, "0")}
                                    onPress={() => setHour(option)}
                                    radius={hourRadius}
                                    total={24}
                                    value={option}
                                />
                            ))}

                            {minuteSteps.map((option) => (
                                <ClockOption
                                    isSelected={option === closestMinuteStep(minute)}
                                    key={`minute-${option}`}
                                    label={String(option).padStart(2, "0")}
                                    onPress={() => selectMinuteStep(option)}
                                    radius={minuteRadius}
                                    total={60}
                                    value={option}
                                />
                            ))}
                        </View>

                        <Button className="mt-5" label="Confirmar horário" onPress={confirm}>
                            <Check color={colors.surface} size={18} />
                        </Button>
                    </View>
                </View>
            </Modal>
        </>
    );
}
import { useEffect, useMemo, useRef, useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    View,
    type NativeScrollEvent,
    type NativeSyntheticEvent
} from "react-native";
import { Check, Clock3, X } from "lucide-react-native";

import { AppText } from "@/components/system/typography/AppText";
import { Button } from "@/components/ui/action/button/Button";
import { colors } from "@/theme/colors";

import { type MaskedInputProps, ReadonlyInput } from "../shared/InputPrimitives";

const itemHeight = 44;
const visibleItems = 5;
const wheelPadding = itemHeight * Math.floor(visibleItems / 2);
const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, "0"));

type WheelColumnProps = {
    label: string;
    onChange: (value: number) => void;
    options: string[];
    selectedIndex: number;
};

function parseTime(value?: string) {
    const match = /^(\d{1,2}):(\d{2})$/.exec(value?.trim() ?? "");
    if (!match) return { hour: 0, minute: 0 };

    const hour = Math.min(23, Math.max(0, Number(match[1])));
    const minute = Math.min(59, Math.max(0, Number(match[2])));
    return { hour, minute };
}

function formatTime(hour: number, minute: number) {
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function indexFromScroll(event: NativeSyntheticEvent<NativeScrollEvent>, maxIndex: number) {
    return Math.min(
        maxIndex,
        Math.max(0, Math.round(event.nativeEvent.contentOffset.y / itemHeight))
    );
}

function WheelColumn({ label, onChange, options, selectedIndex }: WheelColumnProps) {
    const scrollRef = useRef<ScrollView | null>(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            scrollRef.current?.scrollTo({ animated: false, y: selectedIndex * itemHeight });
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [selectedIndex]);

    const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const nextIndex = indexFromScroll(event, options.length - 1);
        onChange(nextIndex);
        scrollRef.current?.scrollTo({ animated: true, y: nextIndex * itemHeight });
    };

    return (
        <View className="flex-1 gap-2">
            <AppText center variant="label">
                {label}
            </AppText>
            <View className="relative h-[220px] overflow-hidden rounded-[18px] bg-[#faf8ff]">
                <View className="absolute left-0 right-0 top-[88px] h-11 border-y border-border bg-surface/80" />
                <ScrollView
                    ref={scrollRef}
                    contentContainerStyle={{ paddingVertical: wheelPadding }}
                    decelerationRate="fast"
                    onMomentumScrollEnd={handleScrollEnd}
                    onScrollEndDrag={handleScrollEnd}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={itemHeight}
                >
                    {options.map((option, index) => {
                        const isSelected = index === selectedIndex;

                        return (
                            <Pressable
                                accessibilityRole="button"
                                className="h-11 items-center justify-center"
                                key={option}
                                onPress={() => onChange(index)}
                            >
                                <AppText
                                    className={
                                        isSelected
                                            ? "font-inter-extrabold text-[25px]"
                                            : "font-inter-semibold text-[18px]"
                                    }
                                    color={isSelected ? colors.primary : colors.muted}
                                >
                                    {option}
                                </AppText>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </View>
        </View>
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
                                <AppText className="font-inter-extrabold">
                                    Selecionar horário
                                </AppText>
                                <AppText variant="label">Role para ajustar hora e minuto.</AppText>
                            </View>
                            <Pressable
                                accessibilityRole="button"
                                className="h-10 w-10 items-center justify-center rounded-[20px] bg-primarySoft"
                                onPress={close}
                            >
                                <X color={colors.text} size={20} />
                            </Pressable>
                        </View>

                        <View className="flex-row items-center gap-3">
                            <WheelColumn
                                label="Hora"
                                onChange={setHour}
                                options={hours}
                                selectedIndex={hour}
                            />
                            <View className="pt-6">
                                <AppText
                                    className="font-inter-extrabold text-[30px]"
                                    color={colors.primary}
                                >
                                    :
                                </AppText>
                            </View>
                            <WheelColumn
                                label="Minuto"
                                onChange={setMinute}
                                options={minutes}
                                selectedIndex={minute}
                            />
                        </View>

                        <View className="mt-5 rounded-[18px] bg-primarySoft px-4 py-3">
                            <AppText
                                center
                                className="font-inter-extrabold text-[28px]"
                                color={colors.primary}
                            >
                                {formatTime(hour, minute)}
                            </AppText>
                        </View>

                        <Button className="mt-4" label="Confirmar horário" onPress={confirm}>
                            <Check color={colors.surface} size={18} />
                        </Button>
                    </View>
                </View>
            </Modal>
        </>
    );
}

import {useMemo, useState} from "react";
import {Modal, Pressable, View} from "react-native";
import {CalendarDays, ChevronLeft, ChevronRight, X} from "lucide-react-native";

import {AppText} from "@/components/system/typography/AppText";
import {colors} from "@/theme/colors";
import {cn} from "@/utils/cn";

import {createMonthDays, formatDate, monthNames, weekDays} from "../shared/dateInputUtils";
import {ReadonlyInput, type PickerInputProps} from "../shared/InputPrimitives";

export type AppDateInputProps = PickerInputProps & {
    onChange?: (date: Date) => void;
    value?: Date | null;
};

function normalizeDate(value?: Date | null) {
    if (!value) return null;
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

export function AppDateInput({onChange, value, ...props}: AppDateInputProps) {
    const [isVisible, setVisible] = useState(false);
    const [internalDate, setInternalDate] = useState<Date | null>(() => normalizeDate(value));
    const [visibleMonth, setVisibleMonth] = useState(() => normalizeDate(value) ?? new Date());
    const selectedDate = useMemo(() => (value === undefined ? internalDate : normalizeDate(value)), [internalDate, value]);
    const displayValue = selectedDate ? formatDate(selectedDate) : "";
    const monthDays = useMemo(() => createMonthDays(visibleMonth), [visibleMonth]);

    const openCalendar = () => {
        if (selectedDate) {
            setVisibleMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
        }

        setVisible(true);
    };

    const selectDay = (day: number) => {
        const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);

        setInternalDate(date);
        onChange?.(date);
        setVisible(false);
    };

    return (
        <>
            <ReadonlyInput
                {...props}
                icon={<CalendarDays color={colors.primary} size={20}/>}
                onPress={openCalendar}
                value={displayValue}
            />
            <Modal animationType="fade" transparent visible={isVisible}>
                <View className="flex-1 items-center justify-center bg-[rgba(23,19,33,0.44)] p-5">
                    <Pressable className="absolute inset-0" onPress={() => setVisible(false)}/>
                    <View className="w-full rounded-card bg-surface p-4">
                        <View className="mb-3 flex-row items-center gap-2">
                            <Pressable
                                className="h-8 w-8 items-center justify-center rounded-2xl bg-primarySoft"
                                onPress={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
                            >
                                <ChevronLeft color={colors.text} size={22}/>
                            </Pressable>
                            <AppText center className="flex-1 font-inter-extrabold">
                                {monthNames[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
                            </AppText>
                            <Pressable
                                className="h-8 w-8 items-center justify-center rounded-2xl bg-primarySoft"
                                onPress={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
                            >
                                <ChevronRight color={colors.text} size={22}/>
                            </Pressable>
                            <Pressable className="h-8 w-8 items-center justify-center rounded-2xl"
                                       onPress={() => setVisible(false)}>
                                <X color={colors.muted} size={18}/>
                            </Pressable>
                        </View>

                        <View className="flex-row">
                            {weekDays.map((weekDay, index) => (
                                <AppText center className="flex-1 py-2" key={`${weekDay}-${index}`} variant="label">
                                    {weekDay}
                                </AppText>
                            ))}
                        </View>

                        <View className="flex-row flex-wrap">
                            {monthDays.map((day, index) => {
                                const currentDate = day
                                    ? new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day)
                                    : null;

                                const isSelected = Boolean(
                                    currentDate &&
                                    selectedDate &&
                                    currentDate.getFullYear() === selectedDate.getFullYear() &&
                                    currentDate.getMonth() === selectedDate.getMonth() &&
                                    currentDate.getDate() === selectedDate.getDate()
                                );

                                return (
                                    <Pressable
                                        accessibilityRole={day ? "button" : undefined}
                                        className={cn("aspect-square w-[14.2857%] items-center justify-center", isSelected && "rounded-[18px] bg-primary")}
                                        disabled={!day}
                                        key={`${day ?? "empty"}-${index}`}
                                        onPress={() => (day ? selectDay(day) : undefined)}
                                    >
                                        {day ? (
                                            <AppText center className="font-inter-bold"
                                                     color={isSelected ? colors.surface : colors.text}>
                                                {day}
                                            </AppText>
                                        ) : null}
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

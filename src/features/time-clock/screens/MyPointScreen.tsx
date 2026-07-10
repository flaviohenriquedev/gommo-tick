import {useEffect, useMemo, useState} from "react";
import {View} from "react-native";

import {Card} from "@/components/system/card/Card";
import {Header} from "@/components/system/header/Header";
import {MetricCard} from "@/components/system/metric-card/MetricCard";
import {Screen} from "@/components/system/screen/Screen";
import {AppText} from "@/components/system/typography/AppText";
import {AppDateInput} from "@/components/ui/data-input/input";
import {PointAdjustmentPanel} from "@/features/time-clock/components/PointAdjustmentPanel";
import {useAttendanceContext, useAttendanceRecords} from "@/features/time-clock/hooks/useAttendance";
import type {AttendanceRecordDto} from "@/features/time-clock/types/attendance.types";
import {
    decimalHoursToLabel,
    minutesToLabel,
    punchEntries,
    workedMinutes
} from "@/features/time-clock/utils/attendanceCalculations";
import {colors} from "@/theme/colors";

const dotColor = {
    success: colors.success,
    warning: "#f4be2a",
    info: colors.info,
    neutral: "#9ca3af"
} as const;

function toIsoDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getWorkedMinutes(record: AttendanceRecordDto | null | undefined, isToday: boolean, now: Date) {
    if (!record) return 0;

    if (!isToday && typeof record.workedHours === "number") {
        return Math.max(0, Math.round(record.workedHours * 60));
    }

    if (!isToday && !record.clockOut) {
        return 0;
    }

    return workedMinutes(record, now);
}

export function MyPointScreen() {
    const contextQuery = useAttendanceContext();
    const [now, setNow] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(() => new Date());
    const selectedDateIso = useMemo(() => toIsoDate(selectedDate), [selectedDate]);
    const todayIso = useMemo(() => toIsoDate(now), [now]);
    const recordsQuery = useAttendanceRecords(selectedDateIso, selectedDateIso);

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 30000);
        return () => clearInterval(id);
    }, []);

    const isTodaySelected = selectedDateIso === todayIso;
    const record = recordsQuery.data?.find((item) => item.workDate === selectedDateIso)
        ?? (isTodaySelected ? contextQuery.data?.todayRecord : null);
    const expectedMinutes = Math.round((record?.expectedHours ?? contextQuery.data?.dailyWorkloadHours ?? 8) * 60);
    const currentWorkedMinutes = getWorkedMinutes(record, isTodaySelected, now);
    const remainingMinutes = Math.max(0, expectedMinutes - currentWorkedMinutes);
    const entries = punchEntries(record);

    return (
        <Screen backgroundColor={colors.surface}>
            <Header title="Meu Ponto"/>
            <AppDateInput
                label="Data do ponto"
                onChange={setSelectedDate}
                placeholder="Selecione a data"
                value={selectedDate}
            />

            <View className="mt-5 flex-row items-center gap-3 rounded-button bg-[#f6f7f6] p-4">
                <AppText className="font-inter-extrabold text-[26px]"
                         color={remainingMinutes === 0 ? colors.success : colors.warning}>
                    {remainingMinutes === 0 ? "✓" : "!"}
                </AppText>
                <AppText variant="subtitle">
                    {remainingMinutes === 0
                        ? "Meta diária atingida"
                        : `Faltam ${minutesToLabel(remainingMinutes)} para atingir sua meta diária`}
                </AppText>
            </View>
            <PointAdjustmentPanel/>
        </Screen>
    );
}

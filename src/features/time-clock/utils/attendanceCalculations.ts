import type {AttendanceRecordDto} from "../types/attendance.types";

const punchLabels: string[] = ["Entrada", "Saída para almoço", "Volta do almoço", "Saída"];

export function createClientRequestId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function formatDateLabel(date = new Date()) {
    const formatted = date.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long"
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatClock(date = new Date()) {
    return date.toLocaleTimeString("pt-BR", {hour: "2-digit", minute: "2-digit", second: "2-digit"});
}

export function formatTime(value?: string) {
    return value ? value.slice(0, 5) : "--:--";
}

export function decimalHoursToLabel(value?: number) {
    const minutes = Math.max(0, Math.round((value ?? 0) * 60));
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;
    return `${String(hours).padStart(2, "0")}h${String(remaining).padStart(2, "0")}`;
}

export function workedMinutes(record?: AttendanceRecordDto | null, now = new Date()) {
    if (!record?.clockIn) return 0;
    const today = record.workDate;
    const toDate = (time?: string) => time ? new Date(`${today}T${time}`) : undefined;
    const clockIn = toDate(record.clockIn);
    const clockOut = toDate(record.clockOut) ?? now;
    if (!clockIn || clockOut < clockIn) return 0;
    const gross = Math.max(0, Math.round((clockOut.getTime() - clockIn.getTime()) / 60000));
    const breakStart = toDate(record.breakStart);
    const breakEnd = toDate(record.breakEnd);
    const breakMinutes = breakStart && breakEnd && breakEnd > breakStart
        ? Math.round((breakEnd.getTime() - breakStart.getTime()) / 60000)
        : record.breakMinutes ?? 0;
    return Math.max(0, gross - breakMinutes);
}

export function minutesToLabel(minutes: number) {
    const safeMinutes = Math.max(0, Math.round(minutes));
    const hours = Math.floor(safeMinutes / 60);
    const remaining = safeMinutes % 60;
    return `${String(hours).padStart(2, "0")}h${String(remaining).padStart(2, "0")}`;
}

export function nextPunchIndex(record?: AttendanceRecordDto | null) {
    if (!record?.clockIn) return 0;
    if (!record.breakStart) return 1;
    if (!record.breakEnd) return 2;
    if (!record.clockOut) return 3;
    return 4;
}

export function nextPunchLabel(record?: AttendanceRecordDto | null) {
    const index = nextPunchIndex(record);
    return index >= punchLabels.length ? "Jornada concluída" : punchLabels[index];
}

export function punchEntries(record?: AttendanceRecordDto | null) {
    return [
        {label: "Entrada", time: formatTime(record?.clockIn), tone: "success" as const},
        {label: "Saída para almoço", time: formatTime(record?.breakStart), tone: "warning" as const},
        {label: "Volta do almoço", time: formatTime(record?.breakEnd), tone: "info" as const},
        {label: "Saída", time: formatTime(record?.clockOut), tone: "neutral" as const}
    ];
}



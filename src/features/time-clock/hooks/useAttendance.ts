import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

import {attendanceService} from "../services/attendance.service";
import type {AttendanceClockPayload} from "../types/attendance.types";

export const attendanceKeys = {
    all: ["attendance"] as const,
    context: () => [...attendanceKeys.all, "mobile-context"] as const,
    records: (from: string, to: string) => [...attendanceKeys.all, "mobile-records", from, to] as const
};

export function useAttendanceContext() {
    return useQuery({
        queryKey: attendanceKeys.context(),
        queryFn: () => attendanceService.getMobileContext()
    });
}

export function useAttendanceRecords(from: string, to: string) {
    return useQuery({
        queryKey: attendanceKeys.records(from, to),
        queryFn: () => attendanceService.getMobileRecords(from, to)
    });
}

export function useClockAttendance() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: AttendanceClockPayload) => attendanceService.clock(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: attendanceKeys.all});
        }
    });
}

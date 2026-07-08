export type AttendanceRequestType =
    | "TIME_ADJUSTMENT"
    | "DAY_ABSENCE_EXCUSE"
    | "MEDICAL_CERTIFICATE"
    | "LEAVE_ABSENCE"
    | "HOUR_BANK"
    | "OTHER";

export type AttendanceAttachmentDto = {
    objectId: string;
    fileName: string;
    documentType: string;
};

export type AttendanceRecordDto = {
    id: string;
    code?: number;
    collaboratorId: string;
    workDate: string;
    clockIn?: string;
    breakStart?: string;
    breakEnd?: string;
    clockOut?: string;
    breakMinutes?: number;
    expectedHours?: number;
    workedHours?: number;
    requestType?: AttendanceRequestType;
    requestStatus?: "PENDING" | "APPROVED" | "REJECTED";
    notes?: string;
    photoObjectId?: string;
    latitude?: number;
    longitude?: number;
    locationAccuracyMeters?: number;
    submittedAt?: string;
};

export type AttendanceMobileContextDto = {
    collaboratorId?: string;
    collaboratorName?: string;
    contractType?: string;
    workloadSchedule?: string;
    dailyWorkloadHours?: number;
    requirePhoto: boolean;
    requireLocation: boolean;
    todayRecord?: AttendanceRecordDto | null;
};

export type AttendanceClockPayload = {
    capturedAt: string;
    photo?: AttendanceAttachmentDto;
    latitude?: number;
    longitude?: number;
    locationAccuracyMeters?: number;
    clientRequestId: string;
};

export type AttendanceClockPhotoFile = {
    uri: string;
    fileName: string;
    mimeType?: string;
    file?: Blob;
};

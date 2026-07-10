export type TickRequestType =
    | "TIME_ADJUSTMENT"
    | "DAY_ABSENCE_EXCUSE"
    | "MEDICAL_CERTIFICATE"
    | "LEAVE_ABSENCE"
    | "HOUR_BANK"
    | "OTHER";

export type TickRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "RETURNED";

export type TickRequestSource = "MOBILE";

export type TickRequestAttachmentDto = {
    objectId: string;
    fileName: string;
    documentType: string;
};

export type TickRequestAttachmentFileDto = {
    uri: string;
    fileName: string;
    mimeType?: string;
    file?: Blob;
};

export type TickRequestCreateDto = {
    requestType: TickRequestType;
    requestDate: string;
    targetRecordId?: string;
    manualPunchTime?: string;
    clockIn?: string;
    breakStart?: string;
    breakEnd?: string;
    clockOut?: string;
    details: string;
    attachment?: TickRequestAttachmentDto;
    source: TickRequestSource;
    clientRequestId: string;
    submittedAt: string;
};

export type TickRequestSubmissionDto = Omit<TickRequestCreateDto, "attachment"> & {
    attachmentFile?: TickRequestAttachmentFileDto;
    attachmentDocumentType?: string;
};

export type TickRequestUpdateDto = Partial<TickRequestCreateDto>;

export type TickRequestResponseDto = {
    id: string;
    code?: number;
    collaboratorId?: string;
    collaboratorName?: string;
    workDate?: string;
    requestDate?: string;
    attendanceRecordId?: string;
    /** @deprecated use attendanceRecordId */
    referenceId?: string;
    targetRecordId?: string;
    requestType: TickRequestType;
    originalClockIn?: string;
    originalClockOut?: string;
    originalBreakStart?: string;
    originalBreakEnd?: string;
    originalNotes?: string;
    clockIn?: string;
    breakStart?: string;
    breakEnd?: string;
    clockOut?: string;
    notes?: string;
    details?: string;
    requestStatus?: TickRequestStatus;
    reviewedAt?: string;
    reviewReason?: string;
    status?: TickRequestStatus;
    source?: TickRequestSource;
    clientRequestId?: string;
    submittedAt?: string;
    createdAt?: string;
    updatedAt?: string;
};

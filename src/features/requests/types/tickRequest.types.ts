export type TickRequestType = "TIME_ADJUSTMENT" | "HOUR_BANK" | "OTHER";

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

export type TickRequestResponseDto = TickRequestCreateDto & {
    id: string;
    status: TickRequestStatus;
    createdAt?: string;
    updatedAt?: string;
};

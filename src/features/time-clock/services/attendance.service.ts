import {CrudService} from "@/services/CrudService";
import {appendUploadFile} from "@/services/uploadFormData";

import type {
    AttendanceClockPayload,
    AttendanceClockPhotoFile,
    AttendanceMobileContextDto,
    AttendanceRecordDto
} from "../types/attendance.types";

type StorageUploadResponseDto = {
    id?: string;
    objectId?: string;
};

class AttendanceService extends CrudService<AttendanceRecordDto, AttendanceClockPayload> {
    constructor() {
        super("/api/v1/attendance-records");
    }

    async getMobileContext() {
        const response = await this.client.get<AttendanceMobileContextDto>(`${this.basePath}/mobile/context`);
        return response.data;
    }

    async getMobileRecords(from: string, to: string) {
        const response = await this.client.get<AttendanceRecordDto[]>(`${this.basePath}/mobile/records`, {
            params: {from, to}
        });
        return response.data;
    }

    async clock(payload: AttendanceClockPayload) {
        const response = await this.client.post<AttendanceRecordDto>(`${this.basePath}/clock`, payload);
        return response.data;
    }

    async uploadPhoto(file: AttendanceClockPhotoFile): Promise<string> {
        const formData = new FormData();
        await appendUploadFile(formData, "file", file);

        const response = await this.client.post<StorageUploadResponseDto>("/api/v1/storage/upload", formData);
        const objectId = response.data.objectId ?? response.data.id;
        if (!objectId) throw new Error("Upload concluído sem identificador da foto.");
        return objectId;
    }
}

export const attendanceService = new AttendanceService();

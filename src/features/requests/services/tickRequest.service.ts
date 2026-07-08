import { CrudService } from "@/services/CrudService";
import { appendUploadFile } from "@/services/uploadFormData";

import type {
    TickRequestAttachmentFileDto,
    TickRequestCreateDto,
    TickRequestResponseDto,
    TickRequestSubmissionDto,
    TickRequestUpdateDto
} from "../types/tickRequest.types";

type StorageUploadResponseDto = {
    id?: string;
    objectId?: string;
};

class TickRequestService extends CrudService<
    TickRequestResponseDto,
    TickRequestCreateDto,
    TickRequestUpdateDto
> {
    constructor() {
        super("/api/v1/attendance-records/submissions");
    }

    async submit(payload: TickRequestSubmissionDto): Promise<TickRequestResponseDto> {
        const { attachmentDocumentType, attachmentFile, ...submissionPayload } = payload;

        if (!attachmentFile) {
            return this.create(submissionPayload);
        }

        const objectId = await this.uploadAttachment(attachmentFile);

        return this.create({
            ...submissionPayload,
            attachment: {
                objectId,
                fileName: attachmentFile.fileName,
                documentType: attachmentDocumentType?.trim() || "Documento"
            }
        });
    }

    private async uploadAttachment(file: TickRequestAttachmentFileDto): Promise<string> {
        const formData = new FormData();
        await appendUploadFile(formData, "file", file);

        const response = await this.client.post<StorageUploadResponseDto>(
            "/api/v1/storage/upload",
            formData
        );
        const objectId = response.data.objectId ?? response.data.id;

        if (!objectId) {
            throw new Error("Upload concluido sem identificador do arquivo.");
        }

        return objectId;
    }
}

export const tickRequestService = new TickRequestService();

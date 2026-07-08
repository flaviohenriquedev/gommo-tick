import {Platform} from "react-native";

export type UploadFormDataFile = {
    uri: string;
    fileName: string;
    mimeType?: string;
    file?: Blob;
};

type ReactNativeFormDataFile = {
    uri: string;
    name: string;
    type?: string;
};

export async function appendUploadFile(formData: FormData, fieldName: string, file: UploadFormDataFile) {
    if (file.file) {
        formData.append(fieldName, file.file, file.fileName);
        return;
    }

    if (Platform.OS === "web") {
        const response = await fetch(file.uri);
        const blob = await response.blob();
        formData.append(fieldName, blob, file.fileName);
        return;
    }

    const filePart: ReactNativeFormDataFile = {
        uri: file.uri,
        name: file.fileName,
        type: file.mimeType ?? "application/octet-stream"
    };

    formData.append(fieldName, filePart as unknown as Blob);
}

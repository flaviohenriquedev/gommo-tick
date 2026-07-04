import {useState} from "react";
import * as DocumentPicker from "expo-document-picker";
import {Upload} from "lucide-react-native";

import {colors} from "@/theme/colors";

import {ReadonlyInput, type PickerInputProps} from "../shared/InputPrimitives";

export type AppFileInputValue = DocumentPicker.DocumentPickerAsset;

export type AppFileInputProps = PickerInputProps & {
    accept?: string;
    onChange?: (file: AppFileInputValue) => void;
    value?: AppFileInputValue | null;
};

export function AppFileInput({
                                 accept,
                                 helper,
                                 label,
                                 onChange,
                                 placeholder = "Selecionar arquivo",
                                 style,
                                 value
                             }: AppFileInputProps) {
    const [selectedFile, setSelectedFile] = useState<AppFileInputValue | null>(value ?? null);
    const file = value ?? selectedFile;

    const pickFile = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: true,
            multiple: false,
            type: accept ?? "*/*"
        });

        if (!result.canceled) {
            const pickedFile = result.assets[0];
            setSelectedFile(pickedFile);
            onChange?.(pickedFile);
        }
    };

    return <ReadonlyInput helper={helper} icon={<Upload color={colors.primary} size={20}/>} label={label}
                          onPress={pickFile} placeholder={placeholder} style={style} value={file?.name}/>;
}
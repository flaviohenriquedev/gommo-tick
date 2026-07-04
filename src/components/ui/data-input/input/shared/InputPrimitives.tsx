import type {ReactNode} from "react";
import {Pressable, TextInput, View, type StyleProp, type ViewStyle} from "react-native";

import {AppText} from "@/components/system/typography/AppText";
import {colors} from "@/theme/colors";
import {cn} from "@/utils/cn";

import {AppBaseInput, type AppBaseInputProps, type MaskedInputProps} from "../AppBaseInput";

export type PickerInputProps = {
    error?: string;
    helper?: string;
    label?: string;
    placeholder?: string;
    style?: StyleProp<ViewStyle>;
};

export type AppSelectOption = {
    disabled?: boolean;
    label: string;
    value: string;
};

export type OptionInputProps = PickerInputProps & {
    onChange?: (value: string) => void;
    options: AppSelectOption[];
    value?: string;
};

export function applyMask(mask: (value: string) => string, onChangeText?: (value: string) => void) {
    return (value: string) => onChangeText?.(mask(value));
}

export function selectedLabel(options: AppSelectOption[], value?: string) {
    return options.find((option) => option.value === value)?.label ?? "";
}

export function FieldShell({children, error, helper, label, style}: PickerInputProps & { children: ReactNode }) {
    return (
        <View className="w-full gap-2" style={style}>
            {label ? (
                <AppText color={colors.text} variant="label">
                    {label}
                </AppText>
            ) : null}
            {children}
            {error ? (
                <AppText color={colors.error} variant="label">
                    {error}
                </AppText>
            ) : helper ? (
                <AppText variant="label">{helper}</AppText>
            ) : null}
        </View>
    );
}

export function ReadonlyInput({
                                  error,
                                  helper,
                                  icon,
                                  label,
                                  onPress,
                                  placeholder = "Selecionar",
                                  style,
                                  value
                              }: PickerInputProps & { icon?: ReactNode; onPress: () => void; value?: string }) {
    return (
        <FieldShell error={error} helper={helper} label={label} style={style}>
            <Pressable
                accessibilityRole="button"
                className={cn(
                    "h-[52px] flex-row items-center gap-3 rounded-button border bg-surface px-4",
                    error ? "border-error" : "border-border"
                )}
                onPress={onPress}
                style={({pressed}) => (pressed ? {opacity: 0.72} : null)}
            >
                <TextInput
                    caretHidden
                    className="flex-1 font-inter text-[13px] text-ink"
                    editable={false}
                    placeholder={placeholder}
                    placeholderTextColor="#9b94aa"
                    pointerEvents="none"
                    value={value ?? ""}
                />
                {icon}
            </Pressable>
        </FieldShell>
    );
}

export function AppMaskedInput({
                                   keyboardType = "default",
                                   mask,
                                   onChangeText,
                                   ...props
                               }: MaskedInputProps & { mask?: (value: string) => string }) {
    return (
        <AppBaseInput
            {...props}
            keyboardType={keyboardType}
            onChangeText={mask ? applyMask(mask, onChangeText) : onChangeText}
        />
    );
}

export type {AppBaseInputProps, MaskedInputProps};
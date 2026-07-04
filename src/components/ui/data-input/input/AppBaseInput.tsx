import { forwardRef, type ReactNode } from "react";
import {
  TextInput,
  View,
  type KeyboardTypeOptions,
  type StyleProp,
  type TextInputProps,
  type ViewStyle
} from "react-native";

import { AppText } from "@/components/system/typography/AppText";
import { colors } from "@/theme/colors";
import { cn } from "@/utils/cn";

export type AppBaseInputProps = Omit<TextInputProps, "style"> & {
  containerClassName?: string;
  error?: string;
  helper?: string;
  inputClassName?: string;
  label?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const AppBaseInput = forwardRef<TextInput, AppBaseInputProps>(function AppBaseInput(
  {
    containerClassName,
    editable = true,
    error,
    helper,
    inputClassName,
    label,
    leftElement,
    multiline,
    rightElement,
    style,
    ...props
  },
  ref
) {
  return (
    <View className={cn("w-full gap-2", containerClassName)} style={style}>
      {label ? (
        <AppText color={colors.text} variant="label">
          {label}
        </AppText>
      ) : null}

      <View
        className={cn(
          "flex-row items-center gap-3 rounded-button border bg-surface px-4",
          multiline ? "min-h-[132px] py-3" : "h-[52px]",
          error ? "border-error" : "border-border",
          !editable && "opacity-70"
        )}
      >
        {leftElement}
        <TextInput
          {...props}
          className={cn(
            "flex-1 font-inter text-[15px] text-ink",
            multiline && "min-h-[104px] text-top",
            inputClassName
          )}
          editable={editable}
          multiline={multiline}
          placeholderTextColor={props.placeholderTextColor ?? "#9b94aa"}
          ref={ref}
          textAlignVertical={multiline ? "top" : props.textAlignVertical}
        />
        {rightElement}
      </View>

      {error ? (
        <AppText color={colors.error} variant="label">
          {error}
        </AppText>
      ) : helper ? (
        <AppText variant="label">{helper}</AppText>
      ) : null}
    </View>
  );
});

export type MaskedInputProps = Omit<AppBaseInputProps, "keyboardType" | "onChangeText"> & {
  keyboardType?: KeyboardTypeOptions;
  onChangeText?: (value: string) => void;
};
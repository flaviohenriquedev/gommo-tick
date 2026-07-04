import type {PropsWithChildren} from "react";
import {Text, type TextProps} from "react-native";

import {cn} from "@/utils/cn";

type TextVariant = "title" | "subtitle" | "body" | "label" | "clock" | "button";

type AppTextProps = PropsWithChildren<
    TextProps & {
    center?: boolean;
    className?: string;
    color?: string;
    variant?: TextVariant;
}
>;

const variantClassName: Record<TextVariant, string> = {
    title: "font-inter-bold text-[28px] leading-[34px]",
    subtitle: "font-inter-semibold text-sm leading-5 text-muted",
    body: "font-inter text-[15px] leading-[22px]",
    label: "font-inter-semibold text-xs leading-4 text-muted",
    clock: "font-inter-extrabold text-[46px] leading-[56px]",
    button: "font-inter-semibold text-[15px] text-surface"
};

export function AppText({
                            center = false,
                            children,
                            className,
                            color,
                            style,
                            variant = "body",
                            ...props
                        }: AppTextProps) {
    return (
        <Text
            {...props}
            className={cn("text-ink", variantClassName[variant], center && "text-center", className)}
            style={[color ? {color} : null, style]}
        >
            {children}
        </Text>
    );
}
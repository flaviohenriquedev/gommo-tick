import type {PropsWithChildren} from "react";
import {View, type ViewProps} from "react-native";

import {cn} from "@/utils/cn";

type CardProps = PropsWithChildren<ViewProps & { className?: string }>;

export function Card({children, className, style, ...props}: CardProps) {
    return (
        <View
            {...props}
            className={cn("rounded-card border border-border bg-surface p-5", className)}
            style={style}
        >
            {children}
        </View>
    );
}
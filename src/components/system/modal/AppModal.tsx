import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { Modal, Pressable, View } from "react-native";
import Animated, {
    Easing,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from "react-native-reanimated";

import { cn } from "@/utils/cn";

type AppModalProps = PropsWithChildren<{
    className?: string;
    onClose: () => void;
    title?: string;
    visible: boolean;
}>;

function blurActiveElement() {
    if (typeof document === "undefined") return;

    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement) {
        activeElement.blur();
    }
}
function hasClassPrefix(className: string | undefined, prefix: string) {
    return className?.split(/\s+/u).some((classItem) => classItem.startsWith(prefix)) ?? false;
}

export function AppModal({ children, className, onClose, visible }: AppModalProps) {
    const progress = useSharedValue(0);
    const backgroundClassName = hasClassPrefix(className, "bg-") ? undefined : "bg-surface";

    useEffect(() => {
        if (visible) {
            blurActiveElement();
            progress.value = 0;
            progress.value = withSpring(1, {
                damping: 22,
                mass: 0.9,
                stiffness: 220
            });
        }
    }, [progress, visible]);

    const handleClose = () => {
        blurActiveElement();
        // Reanimated shared values are intentionally mutable outside React state.
        // eslint-disable-next-line react-hooks/immutability
        progress.value = withTiming(
            0,
            {
                duration: 190,
                easing: Easing.out(Easing.cubic)
            },
            (finished) => {
                if (finished) {
                    runOnJS(onClose)();
                }
            }
        );
    };

    const sheetStyle = useAnimatedStyle(() => ({
        opacity: interpolate(progress.value, [0, 0.3, 1], [0, 1, 1]),
        transform: [
            {
                translateY: interpolate(progress.value, [0, 1], [90, 0])
            },
            {
                scale: interpolate(progress.value, [0, 1], [0.98, 1])
            }
        ]
    }));

    return (
        <Modal animationType="none" onRequestClose={handleClose} transparent visible={visible}>
            <View className="flex-1 justify-end">
                <Pressable className="absolute inset-0" onPress={handleClose} />
                <Animated.View style={sheetStyle}>
                    <View
                        className={cn(
                            "gap-3 rounded-t-sheet border border-border p-5 shadow-2xl",
                            backgroundClassName,
                            className
                        )}
                    >
                        <View className="mb-1 h-1 w-11 self-center rounded-full bg-[#ded7ea]" />
                        {children}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

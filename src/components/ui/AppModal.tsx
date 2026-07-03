import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { X } from "lucide-react-native";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from "react-native-reanimated";

import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { spacing } from "@/theme/spacing";

import { AppText } from "./AppText";

type AppModalProps = PropsWithChildren<{
  onClose: () => void;
  title: string;
  visible: boolean;
}>;

export function AppModal({ children, onClose, title, visible }: AppModalProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      progress.value = 0;
      progress.value = withSpring(1, {
        damping: 22,
        mass: 0.9,
        stiffness: 220
      });
    }
  }, [progress, visible]);

  const handleClose = () => {
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

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1])
  }));

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
      <View style={styles.container}>
        <Animated.View style={[styles.backdrop, overlayStyle]}>
          <Pressable accessibilityRole="button" onPress={handleClose} style={StyleSheet.absoluteFill} />
        </Animated.View>

        <Animated.View style={[styles.sheet, sheetStyle]}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <AppText variant="subtitle">{title}</AppText>
            <Pressable accessibilityRole="button" onPress={handleClose} style={styles.closeButton}>
              <X color={colors.text} size={20} />
            </Pressable>
          </View>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end"
  },
  backdrop: {
    backgroundColor: "rgba(23, 19, 33, 0.44)",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    gap: spacing[3],
    padding: spacing[5],
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 1,
    shadowRadius: 28,
    elevation: 10
  },
  handle: {
    alignSelf: "center",
    backgroundColor: "#ded7ea",
    borderRadius: 99,
    height: 4,
    marginBottom: spacing[1],
    width: 44
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  closeButton: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36
  }
});

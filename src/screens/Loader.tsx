import React, { FC, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Animated,
  Easing,
  Dimensions,
  Text,
  Platform,
} from "react-native";
import { BlurView } from "@react-native-community/blur";

interface FutureLoaderProps {
  visible: boolean;
}

const { width } = Dimensions.get("window");

const Loader: FC<FutureLoaderProps> = ({
  visible,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const rotateLoop = useRef<Animated.CompositeAnimation | null>(null);
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (visible) {
      startAnimation();
    } else {
      stopAnimation();
    }

    return () => {
      stopAnimation();
    };
  }, [visible]);

  const startAnimation = () => {
    rotateAnim.setValue(0);

    rotateLoop.current = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    pulseLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    rotateLoop.current.start();
    pulseLoop.current.start();
  };

  const stopAnimation = () => {
    rotateLoop.current?.stop();
    pulseLoop.current?.stop();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.container}>

        <BlurView
          style={StyleSheet.absoluteFill}
          blurType={Platform.OS === "ios" ? "dark" : "dark"}
          blurAmount={20}
          reducedTransparencyFallbackColor="rgba(0,0,0,0.7)"
        />

        <View style={styles.glassCard}>
          <Animated.View
            style={[
              styles.outerRing,
              {
                transform: [{ rotate }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.innerCore,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />

        </View>
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  glassCard: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },
  outerRing: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: "#00F5FF",
    shadowColor: "#00F5FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 15,
    elevation: 10,
  },
  innerCore: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#00F5FF",
    shadowColor: "#00F5FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 12,
  },
  text: {
    position: "absolute",
    bottom: 20,
    color: "#00F5FF",
    fontSize: 14,
    letterSpacing: 2,
  },
});
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { X, Heart } from "lucide-react-native";
import Animated from "react-native-reanimated";

interface BreathingModalProps {
  visible: boolean;
  onCancel: () => void;
  breathingPhase: "inhale" | "holdIn" | "exhale" | "holdOut";
  breathingTimeLeft: number;
  animatedBubbleStyle: any;
  animatedGlowStyle: any;
}

export const BreathingModal: React.FC<BreathingModalProps> = ({
  visible,
  onCancel,
  breathingPhase,
  breathingTimeLeft,
  animatedBubbleStyle,
  animatedGlowStyle,
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.breathingOverlay}>
        <SafeAreaView style={styles.breathingContainer}>
          <View style={styles.breathingHeader}>
            <Text style={styles.breathingTitle}>Craving Deflection</Text>
            <TouchableOpacity onPress={onCancel} style={styles.breathingCloseBtn}>
              <X color="#ffffff" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.breathingCenter}>
            {/* Pulsing visual glow */}
            <Animated.View style={[styles.breathingGlow, animatedGlowStyle]} />
            {/* Main breathing bubble */}
            <Animated.View style={[styles.breathingBubble, animatedBubbleStyle]}>
              <Heart size={36} color="#0d0f12" fill="#0d0f12" />
            </Animated.View>

            {/* Instructions */}
            <Text style={styles.breathingPhaseText}>
              {breathingPhase === "inhale" && "Inhale Slowly"}
              {breathingPhase === "holdIn" && "Hold Your Breath"}
              {breathingPhase === "exhale" && "Exhale Completely"}
              {breathingPhase === "holdOut" && "Pause & Relax"}
            </Text>
            <Text style={styles.breathingHelperText}>
              {breathingPhase === "inhale" && "Expand your lungs"}
              {breathingPhase === "holdIn" && "Settle your mind"}
              {breathingPhase === "exhale" && "Release the tension"}
              {breathingPhase === "holdOut" && "Wait for the inhale"}
            </Text>
          </View>

          {/* Bottom timer and progress */}
          <View style={styles.breathingFooter}>
            <Text style={styles.breathingTimerText}>
              Remaining: {Math.floor(breathingTimeLeft / 60)}:
              {(breathingTimeLeft % 60).toString().padStart(2, "0")}
            </Text>
            <Text style={styles.breathingSubtext}>
              Riding out the craving. Cravings generally pass in under 3 minutes.
            </Text>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  breathingOverlay: {
    flex: 1,
    backgroundColor: "#0d0f12",
  },
  breathingContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  breathingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  breathingTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  breathingCloseBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1f2937",
    alignItems: "center",
    justifyContent: "center",
  },
  breathingCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  breathingGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(16, 185, 129, 0.2)",
  },
  breathingBubble: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  breathingPhaseText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40,
    textAlign: "center",
  },
  breathingHelperText: {
    color: "#9ca3af",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  breathingFooter: {
    alignItems: "center",
    marginBottom: 40,
  },
  breathingTimerText: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
    marginBottom: 12,
  },
  breathingSubtext: {
    color: "#6b7280",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});

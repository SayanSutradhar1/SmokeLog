import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { ChevronRight, Play, Brain } from "lucide-react-native";

interface ActionButtonsProps {
  onLogPress: () => void;
  onCravePress: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onLogPress,
  onCravePress,
}) => {
  return (
    <View style={styles.container}>
      {/* Primary Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.logButton} onPress={onLogPress}>
          <View style={styles.buttonIconBg}>
            <ChevronRight color="#0d0f12" size={24} />
          </View>
          <Text style={styles.logButtonText}>Log Cigarette</Text>
          <Text style={styles.logButtonSubText}>Creates behavioral friction</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.craveButton} onPress={onCravePress}>
          <Play color="#10b981" size={18} fill="#10b981" />
          <View style={styles.craveButtonTextContainer}>
            <Text style={styles.craveButtonText}>Survive Craving</Text>
            <Text style={styles.craveButtonSubText}>2-Min Mindfulness Bubble</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Mindfulness Tip */}
      <View style={styles.tipCard}>
        <Brain color="#3b82f6" size={24} />
        <View style={styles.tipTextContainer}>
          <Text style={styles.tipTitle}>Why track the gap?</Text>
          <Text style={styles.tipDesc}>
            Delaying a cigarette by just 15 minutes weakens the neural association between the cue and the routine.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  logButton: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "column",
    alignItems: "flex-start",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonIconBg: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -12 }],
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  logButtonText: {
    color: "#0d0f12",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  logButtonSubText: {
    color: "#4b5563",
    fontSize: 11,
  },
  craveButton: {
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.25)",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  craveButtonTextContainer: {
    flex: 1,
  },
  craveButtonText: {
    color: "#10b981",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  craveButtonSubText: {
    color: "rgba(16, 185, 129, 0.7)",
    fontSize: 11,
  },
  tipCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },
  tipTextContainer: {
    flex: 1,
  },
  tipTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  tipDesc: {
    color: "#6b7280",
    fontSize: 12,
    lineHeight: 16,
  },
});

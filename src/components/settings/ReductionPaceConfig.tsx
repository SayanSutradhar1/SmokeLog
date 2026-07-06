import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

interface ReductionPaceConfigProps {
  reductionSpeed: "gentle" | "moderate" | "aggressive";
  onChange: (speed: "gentle" | "moderate" | "aggressive") => void;
}

export const ReductionPaceConfig: React.FC<ReductionPaceConfigProps> = ({
  reductionSpeed,
  onChange,
}) => {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Reduction Pace</Text>
      <Text style={styles.sectionDesc}>
        This controls how rapidly the target interval gap increases each day.
      </Text>

      <View style={styles.speedOptions}>
        <TouchableOpacity
          style={[
            styles.speedCard,
            reductionSpeed === "gentle" && styles.activeSpeedCardGentle,
          ]}
          onPress={() => onChange("gentle")}
        >
          <Text style={styles.speedTitle}>Gentle (+3% daily gap)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.speedCard,
            reductionSpeed === "moderate" && styles.activeSpeedCardModerate,
          ]}
          onPress={() => onChange("moderate")}
        >
          <Text style={styles.speedTitle}>Moderate (+7% daily gap)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.speedCard,
            reductionSpeed === "aggressive" && styles.activeSpeedCardAggressive,
          ]}
          onPress={() => onChange("aggressive")}
        >
          <Text style={styles.speedTitle}>Aggressive (+15% daily gap)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1f2937",
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  sectionDesc: {
    color: "#6b7280",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  speedOptions: {
    gap: 8,
  },
  speedCard: {
    backgroundColor: "#1f2937",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#374151",
  },
  activeSpeedCardGentle: {
    borderColor: "#10b981",
    backgroundColor: "rgba(16, 185, 129, 0.05)",
  },
  activeSpeedCardModerate: {
    borderColor: "#3b82f6",
    backgroundColor: "rgba(59, 130, 246, 0.05)",
  },
  activeSpeedCardAggressive: {
    borderColor: "#f59e0b",
    backgroundColor: "rgba(245, 158, 11, 0.05)",
  },
  speedTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});

import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface PhysicalRecoveryProps {
  healthProgress: {
    oxygen: number;
    nicotine: number;
    cough: number;
    taste: number;
  };
}

export const PhysicalRecovery: React.FC<PhysicalRecoveryProps> = ({ healthProgress }) => {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Physical Recovery</Text>
      <Text style={styles.sectionDesc}>
        Based on the elapsed time since your last cigarette:
      </Text>

      <View style={styles.healthList}>
        {/* Oxygen Progress */}
        <View style={styles.healthItem}>
          <View style={styles.healthHeader}>
            <Text style={styles.healthName}>Blood Oxygen Normalization</Text>
            <Text style={styles.healthPercent}>{healthProgress.oxygen}%</Text>
          </View>
          <View style={styles.barContainer}>
            <View style={[styles.barFill, { width: `${healthProgress.oxygen}%`, backgroundColor: "#10b981" }]} />
          </View>
          <Text style={styles.healthMilestone}>Milestone: 2 hours tobacco-free</Text>
        </View>

        {/* Nicotine Progress */}
        <View style={styles.healthItem}>
          <View style={styles.healthHeader}>
            <Text style={styles.healthName}>93% Nicotine Cleared</Text>
            <Text style={styles.healthPercent}>{healthProgress.nicotine}%</Text>
          </View>
          <View style={styles.barContainer}>
            <View style={[styles.barFill, { width: `${healthProgress.nicotine}%`, backgroundColor: "#3b82f6" }]} />
          </View>
          <Text style={styles.healthMilestone}>Milestone: 8 hours tobacco-free</Text>
        </View>

        {/* Bronchial Coughing Progress */}
        <View style={styles.healthItem}>
          <View style={styles.healthHeader}>
            <Text style={styles.healthName}>Lungs Clearing / Cough Declining</Text>
            <Text style={styles.healthPercent}>{healthProgress.cough}%</Text>
          </View>
          <View style={styles.barContainer}>
            <View style={[styles.barFill, { width: `${healthProgress.cough}%`, backgroundColor: "#8b5cf6" }]} />
          </View>
          <Text style={styles.healthMilestone}>Milestone: 24 hours tobacco-free</Text>
        </View>

        {/* Taste & Smell Progress */}
        <View style={styles.healthItem}>
          <View style={styles.healthHeader}>
            <Text style={styles.healthName}>Taste & Smell Regeneration</Text>
            <Text style={styles.healthPercent}>{healthProgress.taste}%</Text>
          </View>
          <View style={styles.barContainer}>
            <View style={[styles.barFill, { width: `${healthProgress.taste}%`, backgroundColor: "#f59e0b" }]} />
          </View>
          <Text style={styles.healthMilestone}>Milestone: 48 hours tobacco-free</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1f2937",
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  sectionDesc: {
    color: "#6b7280",
    fontSize: 13,
    marginBottom: 20,
  },
  healthList: {
    gap: 18,
  },
  healthItem: {
    width: "100%",
  },
  healthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  healthName: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  healthPercent: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "bold",
  },
  barContainer: {
    height: 6,
    backgroundColor: "#1f2937",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  barFill: {
    height: "100%",
    borderRadius: 3,
  },
  healthMilestone: {
    color: "#6b7280",
    fontSize: 11,
  },
});

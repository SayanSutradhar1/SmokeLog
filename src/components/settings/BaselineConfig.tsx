import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

interface BaselineConfigProps {
  cigsPerDay: number;
  onChange: (val: number) => void;
}

export const BaselineConfig: React.FC<BaselineConfigProps> = ({
  cigsPerDay,
  onChange,
}) => {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Behavioral Baseline</Text>

      {/* Cigarettes Per Day */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Cigarettes per day (Old Habit)</Text>
        <View style={styles.counterRow}>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => onChange(Math.max(1, cigsPerDay - 1))}
          >
            <Text style={styles.counterBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.counterValue}>{cigsPerDay}</Text>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => onChange(cigsPerDay + 1)}
          >
            <Text style={styles.counterBtnText}>+</Text>
          </TouchableOpacity>
        </View>
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
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: "#9ca3af",
    fontSize: 13,
    marginBottom: 8,
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  counterBtn: {
    backgroundColor: "#1f2937",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },
  counterBtnText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  counterValue: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 24,
  },
});

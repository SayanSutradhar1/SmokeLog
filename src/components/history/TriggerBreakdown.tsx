import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SmokeLog } from "@/utils/storage";

interface TriggerBreakdownProps {
  logs: SmokeLog[];
}

export const TriggerBreakdown: React.FC<TriggerBreakdownProps> = ({ logs }) => {
  // Calculate triggers distribution
  const getTriggerStats = () => {
    const counts: { [key: string]: number } = {};
    logs.forEach((log) => {
      counts[log.trigger] = (counts[log.trigger] || 0) + 1;
    });

    const total = logs.length || 1;

    return Object.entries(counts)
      .map(([key, count]) => ({
        id: key,
        label:
          key === "stress"
            ? "Stress Relief"
            : key === "boredom"
            ? "Boredom"
            : key === "routine"
            ? "Routine / Habit"
            : key === "social"
            ? "Social Smoking"
            : key === "craving"
            ? "Strong Craving"
            : "Other Trigger",
        count,
        percentage: (count / total) * 100,
        color:
          key === "stress"
            ? "#ef4444"
            : key === "boredom"
            ? "#3b82f6"
            : key === "routine"
            ? "#f59e0b"
            : key === "social"
            ? "#10b981"
            : key === "craving"
            ? "#8b5cf6"
            : "#6b7280",
      }))
      .sort((a, b) => b.count - a.count);
  };

  const triggerStats = getTriggerStats();

  if (logs.length === 0) return null;

  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Trigger Breakdown</Text>
      <View style={styles.chartList}>
        {triggerStats.map((item) => (
          <View key={item.id} style={styles.chartItem}>
            <View style={styles.chartLabelRow}>
              <Text style={styles.chartLabel}>{item.label}</Text>
              <Text style={styles.chartCount}>
                {item.count} ({Math.round(item.percentage)}%)
              </Text>
            </View>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFill,
                  { width: `${item.percentage}%`, backgroundColor: item.color },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1f2937",
    marginBottom: 24,
  },
  chartTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 16,
  },
  chartList: {
    gap: 14,
  },
  chartItem: {
    width: "100%",
  },
  chartLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  chartLabel: {
    color: "#d1d5db",
    fontSize: 12,
    fontWeight: "500",
  },
  chartCount: {
    color: "#9ca3af",
    fontSize: 11,
    fontWeight: "600",
  },
  barBackground: {
    height: 6,
    backgroundColor: "#1f2937",
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 3,
  },
});

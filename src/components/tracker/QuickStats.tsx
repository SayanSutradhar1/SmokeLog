import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface QuickStatsProps {
  todayStats: {
    count: number;
    averageCraving: number;
  };
  cigarettesPerDay: number;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  todayStats,
  cigarettesPerDay,
}) => {
  return (
    <View style={styles.statsGrid}>
      <View style={styles.statsCard}>
        <Text style={styles.cardLabel}>Today's Smokes</Text>
        <View style={styles.statsRow}>
          <Text style={styles.cardValue}>{todayStats.count}</Text>
          <Text style={styles.cardUnit}>/ {cigarettesPerDay} max</Text>
        </View>
        <Text style={styles.cardSubText}>Compared to baseline</Text>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.cardLabel}>Avg. Craving</Text>
        <View style={styles.statsRow}>
          <Text style={styles.cardValue}>{todayStats.averageCraving}</Text>
          <Text style={styles.cardUnit}>★</Text>
        </View>
        <Text style={styles.cardSubText}>Today's smoke triggers</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statsCard: {
    flex: 1,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 16,
    padding: 16,
  },
  cardLabel: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginVertical: 4,
  },
  cardValue: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
  },
  cardUnit: {
    color: "#6b7280",
    fontSize: 12,
    marginLeft: 4,
  },
  cardSubText: {
    color: "#6b7280",
    fontSize: 10,
  },
});

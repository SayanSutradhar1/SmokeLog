import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Calendar } from "lucide-react-native";

export const EmptyLogsState: React.FC = () => {
  return (
    <View style={styles.emptyContainer}>
      <Calendar color="#374151" size={64} style={styles.emptyIcon} />
      <Text style={styles.emptyTitle}>No logs yet</Text>
      <Text style={styles.emptyText}>
        Every cigarette logged goes here. Tap 'Log Cigarette' on the Gap Tracker tab to start your mindfulness journey.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptyText: {
    color: "#6b7280",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },
});

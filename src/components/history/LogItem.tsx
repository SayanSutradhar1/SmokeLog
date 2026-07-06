import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Trash2 } from "lucide-react-native";
import { LogGapEvaluation } from "@/utils/gapAnalysis";

interface LogItemProps {
  item: LogGapEvaluation;
  onDelete: (id: string) => void;
  formatLogTime: (timestamp: number) => string;
  formatLogDate: (timestamp: number) => string;
}

export const LogItem: React.FC<LogItemProps> = ({
  item,
  onDelete,
  formatLogTime,
  formatLogDate,
}) => {
  const { log, gap, status } = item;

  // Get trigger display config
  const getTriggerBadge = (type: string) => {
    switch (type) {
      case "stress":
        return { label: "Stress", color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)" };
      case "boredom":
        return { label: "Boredom", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)" };
      case "routine":
        return { label: "Routine", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)" };
      case "social":
        return { label: "Social", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)" };
      case "craving":
        return { label: "Craving", color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.15)" };
      default:
        return { label: "Other", color: "#9ca3af", bg: "rgba(156, 163, 175, 0.15)" };
    }
  };

  const formatHourMin = (totalSecs: number | null) => {
    if (totalSecs === null) return "First Log (Baseline)";
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    if (h > 0) {
      return `Gap: ${h}h ${m}m`;
    }
    return `Gap: ${m} mins`;
  };

  const getStatusDetails = (s: string) => {
    switch (s) {
      case "massive":
        return { label: "Massive Improvement! 🎉", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)" };
      case "improvement":
        return { label: "Improvement 👍", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)" };
      case "bad":
        return { label: "Setback ⚠️", color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)" };
      default:
        return { label: "First Log ⏱️", color: "#9ca3af", bg: "rgba(156, 163, 175, 0.15)" };
    }
  };

  const badge = getTriggerBadge(log.trigger);
  const statusDetails = getStatusDetails(status);

  return (
    <View style={styles.logCard}>
      <View style={styles.logMainRow}>
        <View style={styles.logLeft}>
          <Text style={styles.logTime}>{formatLogTime(log.timestamp)}</Text>
          <Text style={styles.logDate}>{formatLogDate(log.timestamp)}</Text>
        </View>
        <View style={styles.logCenter}>
          <View style={[styles.triggerBadge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.triggerBadgeText, { color: badge.color }]}>{badge.label}</Text>
          </View>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Text
                key={s}
                style={[
                  styles.starText,
                  { color: s <= log.cravingStrength ? "#f59e0b" : "#4b5563" },
                ]}
              >
                ★
              </Text>
            ))}
          </View>
        </View>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(log.id)}>
          <Trash2 color="#ef4444" size={16} />
        </TouchableOpacity>
      </View>

      <View style={styles.logDivider} />

      <View style={styles.logFooterRow}>
        <Text style={styles.gapText}>{formatHourMin(gap)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusDetails.bg }]}>
          <Text style={[styles.statusBadgeText, { color: statusDetails.color }]}>
            {statusDetails.label}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1f2937",
    marginBottom: 12,
  },
  logMainRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logLeft: {
    width: 80,
  },
  logTime: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
  },
  logDate: {
    color: "#6b7280",
    fontSize: 11,
    marginTop: 2,
  },
  logCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  triggerBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    overflow: "hidden",
  },
  triggerBadgeText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  starsRow: {
    flexDirection: "row",
  },
  starText: {
    fontSize: 12,
    marginHorizontal: 0.5,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  logDivider: {
    height: 1,
    backgroundColor: "#1f2937",
    marginVertical: 12,
  },
  logFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gapText: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "500",
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    overflow: "hidden",
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
  },
});

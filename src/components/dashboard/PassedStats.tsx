import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Activity } from "lucide-react-native";
import { SmokeLog, CravingSession } from "@/utils/storage";
import { LogGapEvaluation } from "@/utils/gapAnalysis";

interface PassedStatsProps {
  logs: SmokeLog[];
  cravings: CravingSession[];
  avgGap: number | null;
  highestGap: number | null;
  lowestGap: number | null;
  evaluatedLogs: LogGapEvaluation[];
  formatHourMin: (totalSecs: number | null) => string;
}

export const PassedStats: React.FC<PassedStatsProps> = ({
  logs,
  cravings,
  avgGap,
  highestGap,
  lowestGap,
  evaluatedLogs,
  formatHourMin,
}) => {
  // Craving session stats
  const completedCravings = cravings.filter((c) => c.completed).length;
  const totalCravings = cravings.length;
  const cravingSuccessRate = totalCravings > 0 ? Math.round((completedCravings / totalCravings) * 100) : 0;

  // Log status breakdown counts
  const statusCounts = { massive: 0, improvement: 0, bad: 0, initial: 0 };
  evaluatedLogs.forEach((item) => {
    if (item.status in statusCounts) {
      statusCounts[item.status as keyof typeof statusCounts]++;
    }
  });

  const totalEvaluated = evaluatedLogs.length || 1;
  const statusPercentages = {
    massive: Math.round((statusCounts.massive / totalEvaluated) * 100),
    improvement: Math.round((statusCounts.improvement / totalEvaluated) * 100),
    bad: Math.round((statusCounts.bad / totalEvaluated) * 100),
    initial: Math.round((statusCounts.initial / totalEvaluated) * 100),
  };

  // Trigger Breakdown stats
  const getTriggerBreakdown = () => {
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
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  };

  const triggerBreakdown = getTriggerBreakdown();

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Activity color="#3b82f6" size={20} />
        <Text style={styles.sectionTitle}>Passed Activities Stats</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statsGridRow}>
          <View style={styles.statsBox}>
            <Text style={styles.statsBoxValue}>{logs.length}</Text>
            <Text style={styles.statsBoxLabel}>Total Logs</Text>
          </View>
          <View style={styles.statsBox}>
            <Text style={styles.statsBoxValue}>{formatHourMin(avgGap)}</Text>
            <Text style={styles.statsBoxLabel}>Average Gap</Text>
          </View>
        </View>

        <View style={styles.statsGridRow}>
          <View style={styles.statsBox}>
            <Text style={styles.statsBoxValue}>{formatHourMin(highestGap)}</Text>
            <Text style={styles.statsBoxLabel}>Highest Gap</Text>
          </View>
          <View style={styles.statsBox}>
            <Text style={styles.statsBoxValue}>{formatHourMin(lowestGap)}</Text>
            <Text style={styles.statsBoxLabel}>Lowest Gap</Text>
          </View>
        </View>

        <View style={styles.statsGridRow}>
          <View style={styles.statsBox}>
            <Text style={styles.statsBoxValue}>{completedCravings}/{totalCravings}</Text>
            <Text style={styles.statsBoxLabel}>Craving Sessions</Text>
          </View>
          <View style={styles.statsBox}>
            <Text style={styles.statsBoxValue}>{cravingSuccessRate}%</Text>
            <Text style={styles.statsBoxLabel}>Success Rate</Text>
          </View>
        </View>
      </View>

      {/* Log Status Breakdown */}
      {logs.length > 1 && (
        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>Log Interval Evaluations</Text>
          <View style={styles.breakdownList}>
            <View style={styles.breakdownItem}>
              <View style={styles.breakdownHeaderRow}>
                <Text style={[styles.breakdownLabel, { color: "#10b981" }]}>Massive Extension (New Record)</Text>
                <Text style={styles.breakdownCount}>
                  {statusCounts.massive} ({statusPercentages.massive}%)
                </Text>
              </View>
              <View style={styles.barContainer}>
                <View style={[styles.barFill, { width: `${statusPercentages.massive}%`, backgroundColor: "#10b981" }]} />
              </View>
            </View>

            <View style={styles.breakdownItem}>
              <View style={styles.breakdownHeaderRow}>
                <Text style={[styles.breakdownLabel, { color: "#3b82f6" }]}>Improvement (Above Average)</Text>
                <Text style={styles.breakdownCount}>
                  {statusCounts.improvement} ({statusPercentages.improvement}%)
                </Text>
              </View>
              <View style={styles.barContainer}>
                <View style={[styles.barFill, { width: `${statusPercentages.improvement}%`, backgroundColor: "#3b82f6" }]} />
              </View>
            </View>

            <View style={styles.breakdownItem}>
              <View style={styles.breakdownHeaderRow}>
                <Text style={[styles.breakdownLabel, { color: "#ef4444" }]}>Short Gap (Below Average)</Text>
                <Text style={styles.breakdownCount}>
                  {statusCounts.bad} ({statusPercentages.bad}%)
                </Text>
              </View>
              <View style={styles.barContainer}>
                <View style={[styles.barFill, { width: `${statusPercentages.bad}%`, backgroundColor: "#ef4444" }]} />
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Primary Triggers */}
      {triggerBreakdown.length > 0 && (
        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>Top Logging Triggers</Text>
          <View style={styles.triggerContainer}>
            {triggerBreakdown.slice(0, 3).map((item) => (
              <View key={item.id} style={styles.triggerCard}>
                <Text style={styles.triggerLabel}>{item.label}</Text>
                <View style={styles.triggerRow}>
                  <Text style={styles.triggerPercentage}>{item.percentage}%</Text>
                  <Text style={styles.triggerCount}>{item.count} times</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1f2937",
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  statsGrid: {
    gap: 10,
    marginBottom: 18,
  },
  statsGridRow: {
    flexDirection: "row",
    gap: 10,
  },
  statsBox: {
    flex: 1,
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.02)",
  },
  statsBoxValue: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statsBoxLabel: {
    color: "#9ca3af",
    fontSize: 11,
  },
  breakdownSection: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#1f2937",
    paddingTop: 14,
  },
  breakdownTitle: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12,
  },
  breakdownList: {
    gap: 10,
  },
  breakdownItem: {
    width: "100%",
  },
  breakdownHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  breakdownLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  breakdownCount: {
    color: "#9ca3af",
    fontSize: 11,
    fontWeight: "500",
  },
  barContainer: {
    height: 8,
    backgroundColor: "#1f2937",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
  triggerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  triggerCard: {
    flex: 1,
    minWidth: 100,
    backgroundColor: "#1f2937",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.03)",
  },
  triggerLabel: {
    color: "#d1d5db",
    fontSize: 11,
    fontWeight: "500",
    marginBottom: 4,
  },
  triggerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  triggerPercentage: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "bold",
  },
  triggerCount: {
    color: "#6b7280",
    fontSize: 10,
  },
});

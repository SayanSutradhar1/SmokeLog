import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TrendingUp } from "lucide-react-native";
import { TrajectoryAnalysis } from "@/utils/gapAnalysis";

interface BehavioralStatusProps {
  trajectory: TrajectoryAnalysis;
  secondsSinceLastSmoke: number | null;
  targetGapSeconds: number;
  progressToTarget: number;
  formatTime: (totalSecs: number | null) => string;
  formatHourMin: (totalSecs: number | null) => string;
}

export const BehavioralStatus: React.FC<BehavioralStatusProps> = ({
  trajectory,
  secondsSinceLastSmoke,
  targetGapSeconds,
  progressToTarget,
  formatTime,
  formatHourMin,
}) => {
  // Trajectory Badge Config
  const getTrajectoryConfig = () => {
    switch (trajectory.status) {
      case "excellent":
        return {
          title: "Correct Way",
          color: "#10b981",
          bg: "rgba(16, 185, 129, 0.15)",
          description: "Gaps are widening significantly. Great trigger control!",
        };
      case "steady":
        return {
          title: "Steady Pace",
          color: "#3b82f6",
          bg: "rgba(59, 130, 246, 0.15)",
          description: "Maintaining consistency. Keep extending your wait times.",
        };
      case "slipping":
        return {
          title: "Slipped",
          color: "#ef4444",
          bg: "rgba(239, 68, 68, 0.15)",
          description: "Gaps are narrowing. Try deep breathing to delay smoking.",
        };
      default:
        return {
          title: "Collecting Data",
          color: "#9ca3af",
          bg: "rgba(156, 163, 175, 0.15)",
          description: "We need at least 3 logs to establish your trajectory.",
        };
    }
  };

  const trajectoryConfig = getTrajectoryConfig();

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <TrendingUp color="#10b981" size={20} />
        <Text style={styles.sectionTitle}>Behavioral Status</Text>
      </View>

      <View style={[styles.trajectoryStatusContainer, { backgroundColor: trajectoryConfig.bg }]}>
        <View style={styles.statusPillRow}>
          <Text style={[styles.trajectoryStatusText, { color: trajectoryConfig.color }]}>
            {trajectoryConfig.title}
          </Text>
          {trajectory.status !== "insufficient" && (
            <Text style={styles.scoreText}>Score: {trajectory.score}/100</Text>
          )}
        </View>
        <Text style={styles.statusDescription}>{trajectoryConfig.description}</Text>
      </View>

      {/* Linear Score Bar */}
      {trajectory.status !== "insufficient" && (
        <View style={styles.scoreProgressContainer}>
          <View style={styles.scoreProgressLabels}>
            <Text style={styles.progressLabel}>Control</Text>
            <Text style={styles.progressLabel}>Steady</Text>
            <Text style={styles.progressLabel}>Excellent</Text>
          </View>
          <View style={styles.scoreBarBackground}>
            <View
              style={[
                styles.scoreBarFill,
                {
                  width: `${trajectory.score}%`,
                  backgroundColor: trajectoryConfig.color,
                },
              ]}
            />
          </View>
        </View>
      )}

      {/* Current gap and active status */}
      <View style={styles.gridRow}>
        <View style={styles.gridCell}>
          <Text style={styles.gridCellLabel}>Last Smoke Time</Text>
          <Text style={styles.gridCellValue}>{formatTime(secondsSinceLastSmoke)}</Text>
          <Text style={styles.gridCellSub}>Elapsed duration</Text>
        </View>
        <View style={styles.gridCell}>
          <Text style={styles.gridCellLabel}>Target Gap</Text>
          <Text style={styles.gridCellValue}>{formatHourMin(targetGapSeconds)}</Text>
          <Text style={styles.gridCellSub}>Required interval</Text>
        </View>
      </View>

      {/* Today's Stats & Pace */}
      <View style={styles.progressSection}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>Gap Progress to Next Target</Text>
          <Text style={styles.progressPercent}>{Math.round(progressToTarget * 100)}%</Text>
        </View>
        <View style={styles.barContainer}>
          <View
            style={[
              styles.barFill,
              {
                width: `${progressToTarget * 100}%`,
                backgroundColor: progressToTarget >= 1 ? "#10b981" : "#f59e0b",
              },
            ]}
          />
        </View>
      </View>
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
  trajectoryStatusContainer: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  statusPillRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  trajectoryStatusText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scoreText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  statusDescription: {
    color: "#d1d5db",
    fontSize: 12,
    lineHeight: 16,
  },
  scoreProgressContainer: {
    marginBottom: 18,
  },
  scoreProgressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressLabel: {
    color: "#6b7280",
    fontSize: 10,
    fontWeight: "600",
  },
  scoreBarBackground: {
    height: 6,
    backgroundColor: "#1f2937",
    borderRadius: 3,
    overflow: "hidden",
  },
  scoreBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  gridRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  gridCell: {
    flex: 1,
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 12,
  },
  gridCellLabel: {
    color: "#9ca3af",
    fontSize: 11,
    fontWeight: "500",
    marginBottom: 4,
  },
  gridCellValue: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  gridCellSub: {
    color: "#6b7280",
    fontSize: 10,
    marginTop: 2,
  },
  progressSection: {
    marginTop: 4,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  progressText: {
    color: "#9ca3af",
    fontSize: 12,
  },
  progressPercent: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
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
});

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TrajectoryAnalysis } from "@/utils/gapAnalysis";

interface TrajectoryCardProps {
  trajectory: TrajectoryAnalysis;
  formatHourMin: (totalSecs: number) => string;
}

export const TrajectoryCard: React.FC<TrajectoryCardProps> = ({
  trajectory,
  formatHourMin,
}) => {
  return (
    <View style={styles.trajectoryCard}>
      <View style={styles.trajectoryHeader}>
        <View style={styles.trajectoryTitleContainer}>
          <Text style={styles.trajectoryTitle}>Quit Journey Trajectory</Text>
          <Text style={styles.trajectorySubtitle}>Math-deduced habit tracking</Text>
        </View>
        <View
          style={[
            styles.trajectoryBadge,
            trajectory.status === "excellent"
              ? styles.trajectoryBadgeExcellent
              : trajectory.status === "steady"
              ? styles.trajectoryBadgeSteady
              : trajectory.status === "slipping"
              ? styles.trajectoryBadgeSlipping
              : styles.trajectoryBadgeInsufficient,
          ]}
        >
          <Text
            style={[
              styles.trajectoryBadgeText,
              trajectory.status === "excellent"
                ? styles.excellentText
                : trajectory.status === "steady"
                ? styles.steadyText
                : trajectory.status === "slipping"
                ? styles.slippingText
                : styles.insufficientText,
            ]}
          >
            {trajectory.status === "excellent"
              ? "Correct Way 🎉"
              : trajectory.status === "steady"
              ? "Steady Pace 👍"
              : trajectory.status === "slipping"
              ? "Slipped ⚠️"
              : "Collecting Data ⏱️"}
          </Text>
        </View>
      </View>

      <Text style={styles.trajectoryMessage}>{trajectory.message}</Text>

      {trajectory.status !== "insufficient" && (
        <>
          <View style={styles.scoreSection}>
            <View style={styles.scoreLabelRow}>
              <Text style={styles.scoreLabel}>QUIT PATH SCORE</Text>
              <Text
                style={[
                  styles.scoreValue,
                  {
                    color:
                      trajectory.status === "excellent"
                        ? "#10b981"
                        : trajectory.status === "steady"
                        ? "#3b82f6"
                        : "#ef4444",
                  },
                ]}
              >
                {trajectory.score}/100
              </Text>
            </View>
            <View style={styles.scoreBarBg}>
              <View
                style={[
                  styles.scoreBarFill,
                  {
                    width: `${trajectory.score}%`,
                    backgroundColor:
                      trajectory.status === "excellent"
                        ? "#10b981"
                        : trajectory.status === "steady"
                        ? "#3b82f6"
                        : "#ef4444",
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.trajectoryGapsRow}>
            <View style={styles.trajectoryGapItem}>
              <Text style={styles.trajectoryGapLabel}>Recent Avg Gap</Text>
              <Text style={styles.trajectoryGapValue}>
                {formatHourMin(trajectory.recentAvgGap || 0)}
              </Text>
            </View>
            <View style={styles.trajectoryGapDivider} />
            <View style={styles.trajectoryGapItem}>
              <Text style={styles.trajectoryGapLabel}>All-Time Avg</Text>
              <Text style={styles.trajectoryGapValue}>
                {formatHourMin(trajectory.historicalAvgGap || 0)}
              </Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  trajectoryCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  trajectoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  trajectoryTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  trajectoryTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  trajectorySubtitle: {
    color: "#6b7280",
    fontSize: 12,
    marginTop: 2,
  },
  trajectoryBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  trajectoryBadgeExcellent: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
  },
  trajectoryBadgeSteady: {
    backgroundColor: "rgba(59, 130, 246, 0.15)",
  },
  trajectoryBadgeSlipping: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
  },
  trajectoryBadgeInsufficient: {
    backgroundColor: "rgba(156, 163, 175, 0.15)",
  },
  trajectoryBadgeText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  excellentText: {
    color: "#10b981",
  },
  steadyText: {
    color: "#3b82f6",
  },
  slippingText: {
    color: "#ef4444",
  },
  insufficientText: {
    color: "#9ca3af",
  },
  trajectoryMessage: {
    color: "#9ca3af",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  scoreSection: {
    marginBottom: 16,
  },
  scoreLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  scoreLabel: {
    color: "#6b7280",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  scoreBarBg: {
    height: 6,
    backgroundColor: "#1f2937",
    borderRadius: 3,
    overflow: "hidden",
  },
  scoreBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  trajectoryGapsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(31, 41, 55, 0.3)",
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  trajectoryGapItem: {
    flex: 1,
    alignItems: "center",
  },
  trajectoryGapLabel: {
    color: "#6b7280",
    fontSize: 10,
    marginBottom: 4,
  },
  trajectoryGapValue: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  trajectoryGapDivider: {
    width: 1,
    backgroundColor: "#1f2937",
  },
});

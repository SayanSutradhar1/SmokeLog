import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useResponsive } from "@/hooks/useResponsive";

interface CounterSectionProps {
  secondsSinceLastSmoke: number | null;
  targetGapSeconds: number;
  progressToTarget: number;
  statusInfo: {
    message: string;
    color: string;
    isTargetMet: boolean;
  };
  formatTime: (totalSecs: number | null) => string;
  formatHourMin: (totalSecs: number) => string;
}

export const CounterSection: React.FC<CounterSectionProps> = ({
  secondsSinceLastSmoke,
  targetGapSeconds,
  progressToTarget,
  statusInfo,
  formatTime,
  formatHourMin,
}) => {
  const { width, isTablet, isWideScreen } = useResponsive();

  // Dynamic dial sizes to look beautiful and not overflow on Tablet / Desktop
  const dialSize = isWideScreen ? 320 : isTablet ? 280 : width * 0.76;
  const innerDialSize = dialSize - 24;

  return (
    <View style={styles.container}>
      {/* Live Counter Section */}
      <View style={styles.counterSection}>
        <View
          style={[
            styles.outerDial,
            {
              borderColor: statusInfo.isTargetMet ? "#10b981" : "#f59e0b",
              width: dialSize,
              height: dialSize,
              borderRadius: dialSize / 2,
            },
          ]}
        >
          <View
            style={[
              styles.innerDial,
              {
                width: innerDialSize,
                height: innerDialSize,
                borderRadius: innerDialSize / 2,
              },
            ]}
          >
            <Text style={styles.counterTitle}>TIME SINCE LAST CIGARETTE</Text>
            <Text style={[styles.counterText, { color: statusInfo.isTargetMet ? "#10b981" : "#ffffff" }]}>
              {formatTime(secondsSinceLastSmoke)}
            </Text>
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${progressToTarget * 100}%`,
                    backgroundColor: statusInfo.isTargetMet ? "#10b981" : "#f59e0b",
                  },
                ]}
              />
            </View>
            <Text style={styles.targetLabel}>Target Gap: {formatHourMin(targetGapSeconds)}</Text>
          </View>
        </View>
      </View>

      {/* Info Banner */}
      <View style={[styles.statusBanner, { backgroundColor: statusInfo.isTargetMet ? "rgba(16, 185, 129, 0.08)" : "rgba(245, 158, 11, 0.08)" }]}>
        <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  counterSection: {
    alignItems: "center",
    marginVertical: 10,
  },
  outerDial: {
    borderWidth: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    backgroundColor: "#111827",
  },
  innerDial: {
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  counterTitle: {
    color: "#9ca3af",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 2,
    textAlign: "center",
  },
  counterText: {
    fontSize: 38,
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
    marginVertical: 14,
  },
  progressContainer: {
    width: "70%",
    height: 6,
    backgroundColor: "#1f2937",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  targetLabel: {
    color: "#6b7280",
    fontSize: 12,
    textAlign: "center",
  },
  statusBanner: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginVertical: 16,
    alignItems: "center",
    width: "100%",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 18,
  },
});

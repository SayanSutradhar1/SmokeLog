import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSmoke } from "@/hooks/useSmoke";
import { useResponsive } from "@/hooks/useResponsive";
import { LayoutDashboard, Brain } from "lucide-react-native";
import { BehavioralStatus } from "@/components/dashboard/BehavioralStatus";
import { PassedStats } from "@/components/dashboard/PassedStats";
import { MetricsGuide } from "@/components/dashboard/MetricsGuide";

export default function DashboardScreen() {
  const {
    logs,
    cravings,
    loading,
    secondsSinceLastSmoke,
    targetGapSeconds,
    progressToTarget,
    lowestGap,
    highestGap,
    avgGap,
    evaluatedLogs,
    trajectory,
  } = useSmoke();

  const { isMobile } = useResponsive();

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </SafeAreaView>
    );
  }

  // Formatting helpers
  const formatTime = (totalSecs: number | null) => {
    if (totalSecs === null) return "--:--:--";
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatHourMin = (totalSecs: number | null) => {
    if (totalSecs === null || totalSecs === 0) return "0 mins";
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    if (h > 0) {
      return `${h}h ${m}m`;
    }
    return `${m}m`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={[styles.header, !isMobile && { alignSelf: "center", width: "100%", maxWidth: 1040 }]}>
          <View style={styles.headerRow}>
            <View style={styles.headerIconBg}>
              <LayoutDashboard color="#10b981" size={22} />
            </View>
            <View>
              <Text style={styles.title}>Dashboard</Text>
              <Text style={styles.subtitle}>Overview of control & habit analysis</Text>
            </View>
          </View>
        </View>

        {/* Responsive Grid for Status and Stats */}
        <View style={isMobile ? styles.stackedLayout : styles.rowLayout}>
          <View style={isMobile ? styles.stackedColumn : styles.leftColumn}>
            {/* 1. SMOKE BEHAVIOUR STATUS */}
            <BehavioralStatus
              trajectory={trajectory}
              secondsSinceLastSmoke={secondsSinceLastSmoke}
              targetGapSeconds={targetGapSeconds}
              progressToTarget={progressToTarget}
              formatTime={formatTime}
              formatHourMin={formatHourMin}
            />
          </View>

          <View style={isMobile ? styles.stackedColumn : styles.rightColumn}>
            {/* 2. PASSED ACTIVITIES STATS */}
            <PassedStats
              logs={logs}
              cravings={cravings}
              avgGap={avgGap}
              highestGap={highestGap}
              lowestGap={lowestGap}
              evaluatedLogs={evaluatedLogs}
              formatHourMin={formatHourMin}
            />
          </View>
        </View>

        {/* 3. MEASUREMENTS EXPLANATIONS */}
        <View style={[!isMobile && { alignSelf: "center", width: "100%", maxWidth: 1040 }]}>
          <MetricsGuide />
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Brain color="#6b7280" size={24} />
          <Text style={styles.footerText}>SmokeLog • Mindful Habit Reduction</Text>
          <Text style={styles.footerSubText}>Patience is control. Delay your next trigger.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0f12",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0d0f12",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerIconBg: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#9ca3af",
    fontSize: 13,
    marginTop: 2,
  },
  footer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    gap: 4,
  },
  footerText: {
    color: "#4b5563",
    fontSize: 12,
    fontWeight: "600",
  },
  footerSubText: {
    color: "#374151",
    fontSize: 10,
  },
  stackedLayout: {
    width: "100%",
  },
  rowLayout: {
    flexDirection: "row",
    gap: 20,
    width: "100%",
    maxWidth: 1040,
    alignSelf: "center",
  },
  stackedColumn: {
    width: "100%",
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 1.2,
  },
});

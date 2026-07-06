import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSmoke } from "@/hooks/useSmoke";
import { useResponsive } from "@/hooks/useResponsive";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  cancelAnimation,
  Easing,
} from "react-native-reanimated";

import { CounterSection } from "@/components/tracker/CounterSection";
import { TrajectoryCard } from "@/components/tracker/TrajectoryCard";
import { QuickStats } from "@/components/tracker/QuickStats";
import { ActionButtons } from "@/components/tracker/ActionButtons";
import { LogModal } from "@/components/tracker/LogModal";
import { BreathingModal } from "@/components/tracker/BreathingModal";
import { FeedbackModal } from "@/components/tracker/FeedbackModal";

export default function Dashboard() {
  const {
    logs,
    secondsSinceLastSmoke,
    targetGapSeconds,
    progressToTarget,
    addSmoke,
    settings,
    logCravingSession,
    trajectory,
  } = useSmoke();

  // Local state for modals
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [breathingVisible, setBreathingVisible] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [lastEvaluation, setLastEvaluation] = useState<any>(null);

  // Smoke logging form state
  const [selectedTrigger, setSelectedTrigger] = useState("stress");
  const [cravingStrength, setCravingStrength] = useState(3);

  // Breathing exercise state
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "holdIn" | "exhale" | "holdOut">("inhale");
  const [breathingTimeLeft, setBreathingTimeLeft] = useState(120); // 2 minutes (120s)
  const breathingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animation shared values for breathing bubble
  const bubbleScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.4);

  // Trigger choices
  const triggers = [
    { id: "stress", label: "Stress Relief" },
    { id: "boredom", label: "Boredom" },
    { id: "routine", label: "Routine / Habit" },
    { id: "social", label: "Social Smoking" },
    { id: "craving", label: "Strong Craving" },
    { id: "other", label: "Other Trigger" },
  ];

  // Format elapsed time (HH:MM:SS)
  const formatTime = (totalSecs: number | null) => {
    if (totalSecs === null) return "--:--:--";
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Format simple hour / minute text
  const formatHourMin = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    if (h > 0) {
      return `${h}h ${m}m`;
    }
    return `${m} mins`;
  };

  // Get status messages based on gap progress
  const getStatusInfo = () => {
    if (secondsSinceLastSmoke === null) {
      return {
        message: "Log your first cigarette to start the gap timer.",
        color: "#10b981",
        isTargetMet: true,
      };
    }
    if (secondsSinceLastSmoke >= targetGapSeconds) {
      const excess = secondsSinceLastSmoke - targetGapSeconds;
      return {
        message: `Target met! You are stretching your gap by ${formatHourMin(excess)}!`,
        color: "#10b981",
        isTargetMet: true,
      };
    } else {
      const remaining = targetGapSeconds - secondsSinceLastSmoke;
      return {
        message: `${formatHourMin(remaining)} remaining to hit your target gap.`,
        color: "#f59e0b",
        isTargetMet: false,
      };
    }
  };

  const statusInfo = getStatusInfo();

  // Log smoke submit handler
  const handleLogSmokeSubmit = async () => {
    const evalResult = await addSmoke(selectedTrigger, cravingStrength);
    setLogModalVisible(false);
    // Reset inputs
    setSelectedTrigger("stress");
    setCravingStrength(3);

    if (evalResult) {
      setLastEvaluation(evalResult);
      setFeedbackVisible(true);
    }
  };

  // Mindful Breathing exercise lifecycle
  const startBreathingExercise = () => {
    setBreathingVisible(true);
    setBreathingTimeLeft(120);
    setBreathingPhase("inhale");

    // Reanimated animation sequence for box breathing:
    // 1. Inhale (scale 1 -> 1.8 over 4s)
    // 2. Hold (stay at 1.8 for 4s)
    // 3. Exhale (scale 1.8 -> 1 over 4s)
    // 4. Hold (stay at 1 for 4s)
    const runAnimationCycle = () => {
      bubbleScale.value = withSequence(
        withTiming(1.8, { duration: 4000, easing: Easing.out(Easing.ease) }),
        withTiming(1.8, { duration: 4000 }),
        withTiming(1.0, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 4000 })
      );
    };

    runAnimationCycle();

    // Pulse opacity animation for background glow
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 4000 }),
        withTiming(0.4, { duration: 4000 })
      ),
      -1,
      true
    );

    if (breathingTimerRef.current) {
      clearInterval(breathingTimerRef.current);
    }

    // Track state phase changes locally via interval
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed = (elapsed + 1) % 16;
      setBreathingTimeLeft((prev) => {
        if (prev <= 1) {
          if (breathingTimerRef.current) {
            clearInterval(breathingTimerRef.current);
            breathingTimerRef.current = null;
          }
          completeBreathing(true);
          return 0;
        }
        return prev - 1;
      });

      if (elapsed < 4) {
        setBreathingPhase("inhale");
      } else if (elapsed < 8) {
        setBreathingPhase("holdIn");
      } else if (elapsed < 12) {
        setBreathingPhase("exhale");
      } else {
        setBreathingPhase("holdOut");
      }

      // Start new animation cycle every 16s
      if (elapsed === 0) {
        runAnimationCycle();
      }
    }, 1000);

    breathingTimerRef.current = interval;
  };

  const cancelBreathingExercise = () => {
    if (breathingTimerRef.current) {
      clearInterval(breathingTimerRef.current);
      breathingTimerRef.current = null;
    }
    completeBreathing(false);
  };

  const completeBreathing = async (completed: boolean) => {
    setBreathingVisible(false);
    cancelAnimation(bubbleScale);
    cancelAnimation(pulseOpacity);
    bubbleScale.value = 1;
    pulseOpacity.value = 0.4;
    await logCravingSession(120 - breathingTimeLeft, completed);
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (breathingTimerRef.current) {
        clearInterval(breathingTimerRef.current);
      }
    };
  }, []);


  // Breathing animated styles
  const animatedBubbleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: bubbleScale.value }],
    };
  });

  const animatedGlowStyle = useAnimatedStyle(() => {
    return {
      opacity: pulseOpacity.value,
      transform: [{ scale: bubbleScale.value * 1.15 }],
    };
  });

  // Calculate stats for today
  const getTodayStats = () => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayLogs = logs.filter((log) => log.timestamp >= startOfToday.getTime());
    return {
      count: todayLogs.length,
      averageCraving:
        todayLogs.length > 0
          ? Math.round((todayLogs.reduce((acc, curr) => acc + curr.cravingStrength, 0) / todayLogs.length) * 10) / 10
          : 0,
    };
  };

  const todayStats = getTodayStats();
  const { isMobile } = useResponsive();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={[styles.scrollContainer, !isMobile && { alignSelf: "center", width: 600, maxWidth: "100%" }]} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>SmokeLog</Text>
            <Text style={styles.subtitleText}>Mindful Nicotine Reduction</Text>
          </View>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeLabel}>Reduction Pace</Text>
            <Text style={[styles.badgeValue, styles[settings.reductionSpeed]]}>
              {settings.reductionSpeed.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Counter Dial Component */}
        <CounterSection
          secondsSinceLastSmoke={secondsSinceLastSmoke}
          targetGapSeconds={targetGapSeconds}
          progressToTarget={progressToTarget}
          statusInfo={statusInfo}
          formatTime={formatTime}
          formatHourMin={formatHourMin}
        />

        {/* Habit Trajectory Card Component */}
        <TrajectoryCard
          trajectory={trajectory}
          formatHourMin={formatHourMin}
        />

        {/* Quick Stats Grid Component */}
        <QuickStats
          todayStats={todayStats}
          cigarettesPerDay={settings.cigarettesPerDay}
        />

        {/* Action Buttons & Tip Component */}
        <ActionButtons
          onLogPress={() => setLogModalVisible(true)}
          onCravePress={startBreathingExercise}
        />
      </ScrollView>

      {/* Log Smoke Form Modal */}
      <LogModal
        visible={logModalVisible}
        onClose={() => setLogModalVisible(false)}
        selectedTrigger={selectedTrigger}
        setSelectedTrigger={setSelectedTrigger}
        cravingStrength={cravingStrength}
        setCravingStrength={setCravingStrength}
        onSubmit={handleLogSmokeSubmit}
        triggers={triggers}
      />

      {/* Mindful Breathing Exercise Modal */}
      <BreathingModal
        visible={breathingVisible}
        onCancel={cancelBreathingExercise}
        breathingPhase={breathingPhase}
        breathingTimeLeft={breathingTimeLeft}
        animatedBubbleStyle={animatedBubbleStyle}
        animatedGlowStyle={animatedGlowStyle}
      />

      {/* Smoke Log Gap Feedback Modal */}
      <FeedbackModal
        visible={feedbackVisible}
        onClose={() => setFeedbackVisible(false)}
        evaluation={lastEvaluation}
        formatHourMin={formatHourMin}
        onBreathingPress={() => {
          setFeedbackVisible(false);
          startBreathingExercise();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0f12",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 24,
  },
  welcomeText: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "bold",
  },
  subtitleText: {
    color: "#6b7280",
    fontSize: 14,
    marginTop: 2,
  },
  badgeContainer: {
    alignItems: "flex-end",
  },
  badgeLabel: {
    color: "#6b7280",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  badgeValue: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    overflow: "hidden",
  },
  gentle: {
    color: "#10b981",
    backgroundColor: "rgba(16, 185, 129, 0.15)",
  },
  moderate: {
    color: "#3b82f6",
    backgroundColor: "rgba(59, 130, 246, 0.15)",
  },
  aggressive: {
    color: "#f59e0b",
    backgroundColor: "rgba(245, 158, 11, 0.15)",
  },
});

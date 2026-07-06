import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { X } from "lucide-react-native";
import { LogGapEvaluation } from "@/utils/gapAnalysis";

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  evaluation: LogGapEvaluation | null;
  formatHourMin: (totalSecs: number) => string;
  onBreathingPress: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  visible,
  onClose,
  evaluation,
  formatHourMin,
  onBreathingPress,
}) => {
  if (!evaluation) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { maxHeight: "80%" }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Gap Analysis Feedback</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X color="#9ca3af" size={20} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.feedbackContainer} showsVerticalScrollIndicator={false}>
            {/* Visual Status Indicator */}
            <View style={styles.feedbackIconContainer}>
              {evaluation.status === "massive" && (
                <View style={[styles.feedbackBadgeBg, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
                  <Text style={styles.feedbackIconText}>🎉</Text>
                </View>
              )}
              {evaluation.status === "improvement" && (
                <View style={[styles.feedbackBadgeBg, { backgroundColor: "rgba(59, 130, 246, 0.15)" }]}>
                  <Text style={styles.feedbackIconText}>👍</Text>
                </View>
              )}
              {evaluation.status === "bad" && (
                <View style={[styles.feedbackBadgeBg, { backgroundColor: "rgba(239, 68, 68, 0.15)" }]}>
                  <Text style={styles.feedbackIconText}>⚠️</Text>
                </View>
              )}
              {evaluation.status === "initial" && (
                <View style={[styles.feedbackBadgeBg, { backgroundColor: "rgba(156, 163, 175, 0.15)" }]}>
                  <Text style={styles.feedbackIconText}>⏱️</Text>
                </View>
              )}
            </View>

            {/* Status Heading */}
            <Text
              style={[
                styles.feedbackHeading,
                {
                  color:
                    evaluation.status === "massive"
                      ? "#10b981"
                      : evaluation.status === "improvement"
                      ? "#3b82f6"
                      : evaluation.status === "bad"
                      ? "#ef4444"
                      : "#ffffff",
                },
              ]}
            >
              {evaluation.status === "massive" && "Massive Improvement!"}
              {evaluation.status === "improvement" && "Solid Improvement!"}
              {evaluation.status === "bad" && "Slight Setback"}
              {evaluation.status === "initial" && "New Gap Baseline"}
            </Text>

            {/* Gap duration description */}
            <Text style={styles.feedbackSubheading}>
              Gap size:{" "}
              <Text style={styles.highlightText}>
                {evaluation.gap !== null ? formatHourMin(evaluation.gap) : "First Smoke"}
              </Text>
            </Text>

            {/* Main Explanation */}
            <Text style={styles.feedbackDescription}>
              {evaluation.status === "massive" &&
                `Outstanding! You lasted ${formatHourMin(evaluation.gap || 0)} without smoking. This is greater than your historical record of ${formatHourMin(evaluation.historicalMax || 0)}! This massive improvement shows you are breaking the habit chain.`}
              {evaluation.status === "improvement" &&
                `Great job! You waited ${formatHourMin(evaluation.gap || 0)}, which is longer than your average gap of ${formatHourMin(evaluation.historicalAvg || 0)}. Doing this consistently will help you quit permanently.`}
              {evaluation.status === "bad" &&
                `You smoked after only ${formatHourMin(evaluation.gap || 0)}, which is equal to or lower than your average gap of ${formatHourMin(evaluation.historicalAvg || 0)}. Resisting cravings just a bit longer helps weaken the trigger-response loop.`}
              {evaluation.status === "initial" &&
                "First gap baseline registered! From your next log, we will evaluate whether you are improving your wait times relative to your baseline."}
            </Text>

            {/* Stats comparison table */}
            {evaluation.status !== "initial" && (
              <View style={styles.feedbackStatsBox}>
                <View style={styles.feedbackStatRow}>
                  <Text style={styles.feedbackStatLabel}>Your Gap:</Text>
                  <Text style={[styles.feedbackStatValue, { color: "#ffffff" }]}>
                    {formatHourMin(evaluation.gap || 0)}
                  </Text>
                </View>
                <View style={styles.feedbackStatRow}>
                  <Text style={styles.feedbackStatLabel}>Average Gap:</Text>
                  <Text style={styles.feedbackStatValue}>
                    {formatHourMin(evaluation.historicalAvg || 0)}
                  </Text>
                </View>
                <View style={styles.feedbackStatRow}>
                  <Text style={styles.feedbackStatLabel}>Max Gap Record:</Text>
                  <Text style={styles.feedbackStatValue}>
                    {formatHourMin(evaluation.historicalMax || 0)}
                  </Text>
                </View>
              </View>
            )}

            {/* Suggestion action */}
            {evaluation.status === "bad" && (
              <TouchableOpacity
                style={styles.breathingActionBtn}
                onPress={onBreathingPress}
              >
                <Text style={styles.breathingActionBtnText}>Try Breathing Exercise next time</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.modalSubmitBtn,
                {
                  marginTop: 10,
                  width: "100%",
                  backgroundColor:
                    evaluation.status === "massive"
                      ? "#10b981"
                      : evaluation.status === "improvement"
                      ? "#3b82f6"
                      : evaluation.status === "bad"
                      ? "#374151"
                      : "#10b981",
                },
              ]}
              onPress={onClose}
            >
              <Text style={styles.modalSubmitText}>
                {evaluation.status === "bad" ? "I'll Try Better" : "Got it!"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#111827",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "90%",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderBottomWidth: 0,
    width: "100%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1f2937",
    alignItems: "center",
    justifyContent: "center",
  },
  feedbackContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  feedbackIconContainer: {
    marginVertical: 16,
  },
  feedbackBadgeBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  feedbackIconText: {
    fontSize: 36,
  },
  feedbackHeading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  feedbackSubheading: {
    color: "#9ca3af",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 16,
    textAlign: "center",
  },
  highlightText: {
    color: "#10b981",
    fontWeight: "bold",
  },
  feedbackDescription: {
    color: "#9ca3af",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  feedbackStatsBox: {
    backgroundColor: "#1f2937",
    borderRadius: 14,
    padding: 16,
    width: "100%",
    gap: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#374151",
  },
  feedbackStatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feedbackStatLabel: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "500",
  },
  feedbackStatValue: {
    color: "#d1d5db",
    fontSize: 13,
    fontWeight: "bold",
  },
  breathingActionBtn: {
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.4)",
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  breathingActionBtnText: {
    color: "#10b981",
    fontSize: 13,
    fontWeight: "bold",
  },
  modalSubmitBtn: {
    backgroundColor: "#10b981",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalSubmitText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
  },
});

import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
  HelpCircle,
  Clock,
  ChevronUp,
  ChevronDown,
  Zap,
  Activity,
  PiggyBank,
} from "lucide-react-native";

export const MetricsGuide: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <HelpCircle color="#a855f7" size={20} />
        <Text style={styles.sectionTitle}>Understanding the Metrics</Text>
      </View>
      <Text style={styles.measurementIntro}>
        This application uses mathematically derived parameters to evaluate your habit change. Tap on any metric to read its details.
      </Text>

      {/* Target Gap Accordion */}
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => toggleSection("targetGap")}
        activeOpacity={0.7}
      >
        <View style={styles.accordionHeaderLeft}>
          <Clock color="#10b981" size={18} />
          <Text style={styles.accordionTitle}>Target Gap</Text>
        </View>
        {expandedSection === "targetGap" ? <ChevronUp color="#9ca3af" size={18} /> : <ChevronDown color="#9ca3af" size={18} />}
      </TouchableOpacity>
      {expandedSection === "targetGap" && (
        <View style={styles.accordionContent}>
          <Text style={styles.accordionText}>
            Your <Text style={styles.highlightText}>Target Gap</Text> is the minimum duration of time you should wait between consecutive smokes to achieve a progressive habit reduction.
          </Text>
          <Text style={styles.accordionSubTitle}>How it is calculated:</Text>
          <Text style={styles.accordionText}>
            1. <Text style={styles.boldText}>Baseline Gap</Text>: Waking hours (16 hours) divided by your daily cigarette count (e.g., 16h / 16 cigs = 1 hour gap).
          </Text>
          <Text style={styles.accordionText}>
            2. <Text style={styles.boldText}>Speed Multiplier</Text>: Your selected reduction pace adds a daily compounding target increase:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• <Text style={styles.gentleColor}>Gentle</Text>: +3% daily increase</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.moderateColor}>Moderate</Text>: +7% daily increase</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.aggressiveColor}>Aggressive</Text>: +15% daily increase</Text>
          </View>
          <Text style={styles.accordionText}>
            3. <Text style={styles.boldText}>Formula</Text>: <Text style={styles.formulaText}>Baseline Gap × (1 + speedRate × [Days Active - 1])</Text>
          </Text>
        </View>
      )}

      {/* Log Interval Evaluation Accordion */}
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => toggleSection("logEvaluation")}
        activeOpacity={0.7}
      >
        <View style={styles.accordionHeaderLeft}>
          <Zap color="#3b82f6" size={18} />
          <Text style={styles.accordionTitle}>Log Interval Statuses</Text>
        </View>
        {expandedSection === "logEvaluation" ? <ChevronUp color="#9ca3af" size={18} /> : <ChevronDown color="#9ca3af" size={18} />}
      </TouchableOpacity>
      {expandedSection === "logEvaluation" && (
        <View style={styles.accordionContent}>
          <Text style={styles.accordionText}>
            Each time you log a cigarette, the elapsed time since your previous smoke (the "gap") is compared against your past history. It is classified into one of four statuses:
          </Text>
          <View style={styles.statusExplainBlock}>
            <Text style={[styles.statusTitle, { color: "#10b981" }]}>🌱 Massive Extension</Text>
            <Text style={styles.statusDesc}>Your gap since the last smoke exceeded your all-time highest gap. Represents outstanding self-discipline.</Text>
          </View>
          <View style={styles.statusExplainBlock}>
            <Text style={[styles.statusTitle, { color: "#3b82f6" }]}>📈 Improvement</Text>
            <Text style={styles.statusDesc}>Your gap exceeded your historical average gap. You successfully delayed smoking longer than normal.</Text>
          </View>
          <View style={styles.statusExplainBlock}>
            <Text style={[styles.statusTitle, { color: "#ef4444" }]}>⚠️ Short Gap</Text>
            <Text style={styles.statusDesc}>Your gap was shorter than your historical average. The trigger/craving was stronger than average restraint.</Text>
          </View>
          <View style={styles.statusExplainBlock}>
            <Text style={[styles.statusTitle, { color: "#9ca3af" }]}>⏱️ Initial</Text>
            <Text style={styles.statusDesc}>First log ever recorded, or the first gap when there was no prior log to compare against.</Text>
          </View>
        </View>
      )}

      {/* Quit Journey Trajectory Accordion */}
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => toggleSection("trajectory")}
        activeOpacity={0.7}
      >
        <View style={styles.accordionHeaderLeft}>
          <Activity color="#a855f7" size={18} />
          <Text style={styles.accordionTitle}>Quit Journey Trajectory</Text>
        </View>
        {expandedSection === "trajectory" ? <ChevronUp color="#9ca3af" size={18} /> : <ChevronDown color="#9ca3af" size={18} />}
      </TouchableOpacity>
      {expandedSection === "trajectory" && (
        <View style={styles.accordionContent}>
          <Text style={styles.accordionText}>
            The <Text style={styles.highlightText}>Quit Journey Trajectory</Text> tracks your momentum. It mathematically measures whether your smoking frequency is expanding or slipping over time.
          </Text>
          <Text style={styles.accordionSubTitle}>Calculation Logic:</Text>
          <Text style={styles.accordionText}>
            1. <Text style={styles.boldText}>Gap Ratio Comparison</Text>: The average of your recent 3 gaps is compared to your older historical gaps. A ratio higher than 1 indicates widening gaps.
          </Text>
          <Text style={styles.accordionText}>
            2. <Text style={styles.boldText}>Score Adjustment</Text>: We calculate a score (0 to 100). Starting at 50, points are added/subtracted based on the gap ratio, and then adjusted based on the status of your last 5 logs:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• <Text style={styles.boldText}>+8 points</Text> for each Massive Extension log.</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.boldText}>+4 points</Text> for each Improvement log.</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.boldText}>-6 points</Text> for each Short Gap log.</Text>
          </View>
          <Text style={styles.accordionSubTitle}>Score Thresholds:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• <Text style={[styles.boldText, { color: "#10b981" }]}>Correct Way (Score ≥ 75)</Text>: Your gaps are widening rapidly. Highly positive control.</Text>
            <Text style={styles.bulletItem}>• <Text style={[styles.boldText, { color: "#3b82f6" }]}>Steady Pace (Score 45 - 74)</Text>: Your gaps are consistent, but you need to push for wider delays.</Text>
            <Text style={styles.bulletItem}>• <Text style={[styles.boldText, { color: "#ef4444" }]}>Slipped (Score &lt; 45)</Text>: Gaps are contracting. Triggers are winning.</Text>
          </View>
        </View>
      )}

      {/* Health & Savings Accordion */}
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => toggleSection("savings")}
        activeOpacity={0.7}
      >
        <View style={styles.accordionHeaderLeft}>
          <PiggyBank color="#f59e0b" size={18} />
          <Text style={styles.accordionTitle}>Health Progress & Financial Savings</Text>
        </View>
        {expandedSection === "savings" ? <ChevronUp color="#9ca3af" size={18} /> : <ChevronDown color="#9ca3af" size={18} />}
      </TouchableOpacity>
      {expandedSection === "savings" && (
        <View style={styles.accordionContent}>
          <Text style={styles.accordionText}>
            Measurements under the <Text style={styles.highlightText}>Stats & Health</Text> tab calculate the tangible health benefits and dollars saved since you began tracking.
          </Text>
          <View style={styles.statusExplainBlock}>
            <Text style={styles.boldText}>💰 Cigarettes Avoided & Money Saved</Text>
            <Text style={styles.accordionText}>
              We compute how many cigarettes you would have smoked if you followed your old baseline rate since starting the app, then subtract the actual logs:
            </Text>
            <Text style={[styles.formulaText, { marginVertical: 4 }]}>
              Cigarettes Saved = (Baseline Rate × Days Active) - Actual Logs
            </Text>
            <Text style={styles.accordionText}>
              Money Saved is calculated by multiplying cigarettes saved by the cost per single cigarette in settings.
            </Text>
          </View>
          <View style={styles.statusExplainBlock}>
            <Text style={styles.boldText}>❤️ Health Recovery Timers</Text>
            <Text style={styles.accordionText}>
              Physiological normalization timers are calculated from the seconds elapsed since your last logged smoke:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• <Text style={styles.boldText}>2 Hours</Text>: Blood oxygen level returns to normal.</Text>
              <Text style={styles.bulletItem}>• <Text style={styles.boldText}>8 Hours</Text>: 93% of nicotine is cleared from bloodstream.</Text>
              <Text style={styles.bulletItem}>• <Text style={styles.boldText}>24 Hours</Text>: Lungs begin clearing debris, coughing declines.</Text>
              <Text style={styles.bulletItem}>• <Text style={styles.boldText}>48 Hours</Text>: Taste and smell receptors regenerate.</Text>
            </View>
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
  measurementIntro: {
    color: "#9ca3af",
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 14,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1f2937",
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  accordionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  accordionTitle: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  accordionContent: {
    backgroundColor: "rgba(31, 41, 55, 0.4)",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#1f2937",
  },
  accordionText: {
    color: "#9ca3af",
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 6,
  },
  accordionSubTitle: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 6,
    marginBottom: 4,
  },
  highlightText: {
    color: "#10b981",
    fontWeight: "600",
  },
  boldText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  bulletList: {
    paddingLeft: 8,
    marginVertical: 4,
    gap: 4,
  },
  bulletItem: {
    color: "#9ca3af",
    fontSize: 11,
  },
  gentleColor: {
    color: "#10b981",
    fontWeight: "600",
  },
  moderateColor: {
    color: "#3b82f6",
    fontWeight: "600",
  },
  aggressiveColor: {
    color: "#f59e0b",
    fontWeight: "600",
  },
  formulaText: {
    fontFamily: "System",
    backgroundColor: "#1f2937",
    color: "#e5e7eb",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    fontSize: 10,
    alignSelf: "flex-start",
  },
  statusExplainBlock: {
    backgroundColor: "rgba(17, 24, 39, 0.6)",
    borderRadius: 8,
    padding: 10,
    marginVertical: 4,
  },
  statusTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 2,
  },
  statusDesc: {
    color: "#9ca3af",
    fontSize: 10,
    lineHeight: 14,
  },
});

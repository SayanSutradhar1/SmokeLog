import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PiggyBank, HeartPulse } from "lucide-react-native";
import { UserSettings } from "@/utils/storage";

interface FinancialCardsProps {
  moneySaved: number;
  cigarettesSaved: number;
  settings: UserSettings;
}

export const FinancialCards: React.FC<FinancialCardsProps> = ({
  moneySaved,
  cigarettesSaved,
  settings,
}) => {
  return (
    <View style={styles.cardRow}>
      <View style={styles.savingsCard}>
        <View style={[styles.iconBg, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
          <PiggyBank color="#10b981" size={24} />
        </View>
        <Text style={styles.cardLabel}>Money Saved</Text>
        <Text style={styles.cardValue}>
          {settings.currency}
          {moneySaved.toFixed(2)}
        </Text>
        <Text style={styles.cardSubText}>Accumulated savings</Text>
      </View>

      <View style={styles.savingsCard}>
        <View style={[styles.iconBg, { backgroundColor: "rgba(59, 130, 246, 0.15)" }]}>
          <HeartPulse color="#3b82f6" size={24} />
        </View>
        <Text style={styles.cardLabel}>Avoided</Text>
        <Text style={styles.cardValue}>{cigarettesSaved}</Text>
        <Text style={styles.cardSubText}>Cigarettes skipped</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  savingsCard: {
    flex: 1,
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  cardLabel: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "500",
  },
  cardValue: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 4,
  },
  cardSubText: {
    color: "#6b7280",
    fontSize: 10,
  },
});

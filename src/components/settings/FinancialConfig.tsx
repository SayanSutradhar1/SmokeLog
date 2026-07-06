import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from "react-native";

interface FinancialConfigProps {
  currency: string;
  onCurrencyChange: (symbol: string) => void;
  costPerPack: number;
  onCostChange: (cost: number) => void;
  cigsPerPack: number;
  onQuantityChange: (qty: number) => void;
  currencies: string[];
}

export const FinancialConfig: React.FC<FinancialConfigProps> = ({
  currency,
  onCurrencyChange,
  costPerPack,
  onCostChange,
  cigsPerPack,
  onQuantityChange,
  currencies,
}) => {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Financial Config</Text>

      {/* Currency */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Currency Symbols</Text>
        <View style={styles.currencyGrid}>
          {currencies.map((curr) => (
            <TouchableOpacity
              key={curr}
              style={[styles.currencyTab, currency === curr && styles.activeCurrencyTab]}
              onPress={() => onCurrencyChange(curr)}
            >
              <Text
                style={[
                  styles.currencyTabText,
                  currency === curr && styles.activeCurrencyTabText,
                ]}
              >
                {curr}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Pack Cost */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Pack Cost ({currency})</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={costPerPack.toString()}
          onChangeText={(text) => {
            const num = parseFloat(text);
            onCostChange(isNaN(num) ? 0 : num);
          }}
        />
      </View>

      {/* Cigs per pack */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Quantity per pack</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={cigsPerPack.toString()}
          onChangeText={(text) => {
            const num = parseInt(text);
            onQuantityChange(isNaN(num) ? 0 : num);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1f2937",
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: "#9ca3af",
    fontSize: 13,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1f2937",
    color: "#ffffff",
    fontSize: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#374151",
  },
  currencyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  currencyTab: {
    backgroundColor: "#1f2937",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#374151",
  },
  activeCurrencyTab: {
    borderColor: "#10b981",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  currencyTabText: {
    color: "#9ca3af",
    fontSize: 14,
    fontWeight: "bold",
  },
  activeCurrencyTabText: {
    color: "#10b981",
  },
});

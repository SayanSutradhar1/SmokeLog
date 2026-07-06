import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSmoke } from "@/hooks/useSmoke";
import { useResponsive } from "@/hooks/useResponsive";
import { Save, Info } from "lucide-react-native";
import { BaselineConfig } from "@/components/settings/BaselineConfig";
import { FinancialConfig } from "@/components/settings/FinancialConfig";
import { ReductionPaceConfig } from "@/components/settings/ReductionPaceConfig";
import { DangerZone } from "@/components/settings/DangerZone";

export default function SettingsScreen() {
  const { settings, saveUserSettings, resetAll } = useSmoke();
  const { isMobile } = useResponsive();

  // Local form state
  const [cigsPerDay, setCigsPerDay] = useState(settings.cigarettesPerDay);
  const [costPerPackStr, setCostPerPackStr] = useState(settings.costPerPack.toString());
  const [cigsPerPackStr, setCigsPerPackStr] = useState((settings.cigarettesPerPack || 20).toString());
  const [currency, setCurrency] = useState(settings.currency);
  const [reductionSpeed, setReductionSpeed] = useState(settings.reductionSpeed);

  const [hasChanges, setHasChanges] = useState(false);

  const currencies = ["$", "₹", "€", "£", "¥", "₱"];

  const handleFieldChange = (field: string, value: any) => {
    setHasChanges(true);
    if (field === "cigsPerDay") setCigsPerDay(value);
    if (field === "costPerPack") setCostPerPackStr(value);
    if (field === "cigsPerPack") setCigsPerPackStr(value);
    if (field === "currency") setCurrency(value);
    if (field === "reductionSpeed") setReductionSpeed(value);
  };

  const handleSave = async () => {
    const cost = parseFloat(costPerPackStr);
    const qty = parseInt(cigsPerPackStr);

    if (isNaN(cost) || cost < 0) {
      Alert.alert("Validation Error", "Please enter a valid pack cost (must be 0 or greater).");
      return;
    }

    if (isNaN(qty) || qty < 1) {
      Alert.alert("Validation Error", "Please enter a valid quantity of cigarettes per pack (must be 1 or greater).");
      return;
    }

    const updatedSettings = {
      ...settings,
      cigarettesPerDay: cigsPerDay || 10,
      costPerPack: cost,
      cigarettesPerPack: qty,
      currency,
      reductionSpeed,
    };
    await saveUserSettings(updatedSettings);
    setHasChanges(false);
    Alert.alert("Success", "Your profile configuration has been updated.");
  };

  const handleResetData = () => {
    Alert.alert(
      "Reset All Data",
      "WARNING: This will permanently delete your logs, reset your savings, and delete your settings. You will be sent back to the Onboarding setup. Do you want to proceed?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset Everything",
          style: "destructive",
          onPress: async () => {
            await resetAll();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollContainer, !isMobile && { alignSelf: "center", width: 600, maxWidth: "100%" }]} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Adjust your goals and account preferences</Text>
        </View>

        {/* Floating Save Button */}
        {hasChanges && (
          <TouchableOpacity style={styles.saveBanner} onPress={handleSave}>
            <Save color="#0d0f12" size={20} />
            <Text style={styles.saveBannerText}>Save Changes</Text>
          </TouchableOpacity>
        )}

        {/* Baseline Config Component */}
        <BaselineConfig
          cigsPerDay={cigsPerDay}
          onChange={(val) => handleFieldChange("cigsPerDay", val)}
        />

        {/* Financial Config Component */}
        <FinancialConfig
          currency={currency}
          onCurrencyChange={(val) => handleFieldChange("currency", val)}
          costPerPack={costPerPackStr}
          onCostChange={(val) => handleFieldChange("costPerPack", val)}
          cigsPerPack={cigsPerPackStr}
          onQuantityChange={(val) => handleFieldChange("cigsPerPack", val)}
          currencies={currencies}
        />

        {/* Reduction Pace Component */}
        <ReductionPaceConfig
          reductionSpeed={reductionSpeed}
          onChange={(val) => handleFieldChange("reductionSpeed", val)}
        />

        {/* Danger Zone Component */}
        <DangerZone onReset={handleResetData} />

        {/* Footer info */}
        <View style={styles.footerContainer}>
          <Info color="#4b5563" size={16} />
          <Text style={styles.footerText}>
            SmokeLog runs entirely locally. None of your logs are sent to a server.
          </Text>
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
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: 14,
    marginTop: 2,
  },
  saveBanner: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBannerText: {
    color: "#0d0f12",
    fontSize: 15,
    fontWeight: "bold",
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  footerText: {
    color: "#4b5563",
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
});

import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useSmoke } from "@/hooks/useSmoke";
import { useResponsive } from "@/hooks/useResponsive";
import { UserSettings } from "@/utils/storage";

export const Onboarding: React.FC = () => {
  const { saveUserSettings } = useSmoke();
  const { isMobile } = useResponsive();
  const [step, setStep] = useState(1);

  // Form states
  const [cigsPerDay, setCigsPerDay] = useState(10);
  const [costPerPackStr, setCostPerPackStr] = useState("15.00");
  const [cigsPerPackStr, setCigsPerPackStr] = useState("20");
  const [currency, setCurrency] = useState("$");
  const [reductionSpeed, setReductionSpeed] = useState<"gentle" | "moderate" | "aggressive">("moderate");

  const currencies = ["$", "₹", "€", "£", "¥", "₱"];

  const handleNext = () => {
    if (step === 3) {
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
    }

    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    const cost = parseFloat(costPerPackStr);
    const qty = parseInt(cigsPerPackStr);

    const settings: UserSettings = {
      cigarettesPerDay: cigsPerDay || 10,
      costPerPack: isNaN(cost) ? 15.0 : cost,
      cigarettesPerPack: isNaN(qty) ? 20 : qty,
      currency,
      reductionSpeed,
      isOnboarded: true,
      startDate: Date.now(),
    };
    await saveUserSettings(settings);
  };

  const renderWelcome = () => (
    <View style={styles.slide}>
      <Text style={styles.accentText}>SMOKELOG</Text>
      <Text style={styles.title}>Break the Automatic Loop</Text>
      <Text style={styles.description}>
        Smoking is often a subconscious reaction to stress, boredom, or routine.
      </Text>
      <Text style={styles.description}>
        This app helps you bring smoking into conscious awareness. By logging every smoke, and expanding the gap between them, you gradually regain control.
      </Text>
      <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCigarettes = () => (
    <View style={styles.slide}>
      <Text style={styles.stepIndicator}>Step 1 of 3</Text>
      <Text style={styles.title}>Your Baseline</Text>
      <Text style={styles.description}>
        How many cigarettes do you smoke on an average day?
      </Text>

      <View style={styles.counterContainer}>
        <TouchableOpacity
          style={styles.counterBtn}
          onPress={() => setCigsPerDay(Math.max(1, cigsPerDay - 1))}
        >
          <Text style={styles.counterBtnText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.counterValue}>{cigsPerDay}</Text>
        <TouchableOpacity
          style={styles.counterBtn}
          onPress={() => setCigsPerDay(cigsPerDay + 1)}
        >
          <Text style={styles.counterBtnText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subLabel}>cigarettes per day</Text>

      <View style={styles.navigationRow}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
          <Text style={styles.secondaryButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButtonHalf} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFinancials = () => (
    <View style={styles.slide}>
      <Text style={styles.stepIndicator}>Step 2 of 3</Text>
      <Text style={styles.title}>Financial Stats</Text>
      <Text style={styles.description}>
        To calculate money saved, enter the cost of your cigarettes.
      </Text>

      <View style={styles.currencyRow}>
        {currencies.map((curr) => (
          <TouchableOpacity
            key={curr}
            style={[styles.currencyTab, currency === curr && styles.activeCurrencyTab]}
            onPress={() => setCurrency(curr)}
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

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Cost per pack ({currency})</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={costPerPackStr}
          onChangeText={setCostPerPackStr}
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Cigarettes per pack</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={cigsPerPackStr}
          onChangeText={setCigsPerPackStr}
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.navigationRow}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
          <Text style={styles.secondaryButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButtonHalf} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSpeed = () => (
    <View style={styles.slide}>
      <Text style={styles.stepIndicator}>Step 3 of 3</Text>
      <Text style={styles.title}>Reduction Pace</Text>
      <Text style={styles.description}>
        Choose how aggressively you want to widen the gap between cigarettes.
      </Text>

      <View style={styles.speedOptions}>
        <TouchableOpacity
          style={[
            styles.speedCard,
            reductionSpeed === "gentle" && styles.activeSpeedCardGentle,
          ]}
          onPress={() => setReductionSpeed("gentle")}
        >
          <Text style={styles.speedTitle}>Gentle</Text>
          <Text style={styles.speedDesc}>
            Slow and steady. The target gap between cigarettes increases by ~3% each day.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.speedCard,
            reductionSpeed === "moderate" && styles.activeSpeedCardModerate,
          ]}
          onPress={() => setReductionSpeed("moderate")}
        >
          <Text style={styles.speedTitle}>Moderate (Recommended)</Text>
          <Text style={styles.speedDesc}>
            Balanced progress. The target gap increases by ~7% each day.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.speedCard,
            reductionSpeed === "aggressive" && styles.activeSpeedCardAggressive,
          ]}
          onPress={() => setReductionSpeed("aggressive")}
        >
          <Text style={styles.speedTitle}>Aggressive</Text>
          <Text style={styles.speedDesc}>
            Fast results. The target gap increases by ~15% daily. Requires high focus.
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navigationRow}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
          <Text style={styles.secondaryButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButtonHalf} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Finish Setup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return renderWelcome();
      case 2:
        return renderCigarettes();
      case 3:
        return renderFinancials();
      case 4:
        return renderSpeed();
      default:
        return renderWelcome();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          !isMobile && { alignSelf: "center", width: 500, maxWidth: "100%" },
        ]}
      >
        {renderStep()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0f12",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  slide: {
    alignItems: "center",
    width: "100%",
  },
  accentText: {
    color: "#10b981",
    fontWeight: "bold",
    letterSpacing: 4,
    fontSize: 16,
    marginBottom: 16,
  },
  stepIndicator: {
    color: "#6b7280",
    fontSize: 14,
    marginBottom: 8,
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    color: "#9ca3af",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: "#10b981",
    paddingVertical: 16,
    width: "100%",
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  counterBtn: {
    backgroundColor: "#1f2937",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },
  counterBtnText: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "300",
  },
  counterValue: {
    color: "#ffffff",
    fontSize: 48,
    fontWeight: "bold",
    marginHorizontal: 30,
  },
  subLabel: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 30,
  },
  navigationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#374151",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#9ca3af",
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButtonHalf: {
    flex: 1,
    backgroundColor: "#10b981",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  currencyRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  currencyTab: {
    backgroundColor: "#1f2937",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#374151",
  },
  activeCurrencyTab: {
    borderColor: "#10b981",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  currencyTabText: {
    color: "#9ca3af",
    fontSize: 16,
    fontWeight: "bold",
  },
  activeCurrencyTabText: {
    color: "#10b981",
  },
  inputGroup: {
    width: "100%",
    marginBottom: 20,
  },
  inputLabel: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  input: {
    backgroundColor: "#1f2937",
    color: "#ffffff",
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
    width: "100%",
  },
  speedOptions: {
    width: "100%",
    gap: 12,
    marginBottom: 20,
  },
  speedCard: {
    backgroundColor: "#1f2937",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
  activeSpeedCardGentle: {
    borderColor: "#10b981",
    backgroundColor: "rgba(16, 185, 129, 0.05)",
  },
  activeSpeedCardModerate: {
    borderColor: "#3b82f6",
    backgroundColor: "rgba(59, 130, 246, 0.05)",
  },
  activeSpeedCardAggressive: {
    borderColor: "#f59e0b",
    backgroundColor: "rgba(245, 158, 11, 0.05)",
  },
  speedTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  speedDesc: {
    color: "#9ca3af",
    fontSize: 13,
    lineHeight: 18,
  },
});

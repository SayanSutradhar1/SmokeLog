import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSmoke } from "@/hooks/useSmoke";
import { useResponsive } from "@/hooks/useResponsive";
import { FinancialCards } from "@/components/savings/FinancialCards";
import { PhysicalRecovery } from "@/components/savings/PhysicalRecovery";
import { Achievements } from "@/components/savings/Achievements";

export default function SavingsScreen() {
  const {
    moneySaved,
    cigarettesSaved,
    healthProgress,
    logs,
    cravings,
    secondsSinceLastSmoke,
    settings,
  } = useSmoke();

  const { isMobile } = useResponsive();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, !isMobile && { alignSelf: "center", width: "100%", maxWidth: 1040 }]}>
          <Text style={styles.title}>Health & Savings</Text>
          <Text style={styles.subtitle}>Track your physical and financial recovery</Text>
        </View>

        {/* Financial Cards Component */}
        <View style={[!isMobile && { alignSelf: "center", width: "100%", maxWidth: 1040 }]}>
          <FinancialCards
            moneySaved={moneySaved}
            cigarettesSaved={cigarettesSaved}
            settings={settings}
          />
        </View>

        {/* Responsive Grid */}
        <View style={isMobile ? styles.stackedLayout : styles.rowLayout}>
          <View style={isMobile ? styles.stackedColumn : styles.leftColumn}>
            {/* Health Progress Recovery Component */}
            <PhysicalRecovery healthProgress={healthProgress} />
          </View>

          <View style={isMobile ? styles.stackedColumn : styles.rightColumn}>
            {/* Achievements Milestone Badges Component */}
            <Achievements
              logs={logs}
              cravings={cravings}
              secondsSinceLastSmoke={secondsSinceLastSmoke}
              moneySaved={moneySaved}
              settings={settings}
            />
          </View>
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
    paddingBottom: 40,
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
    flex: 1.1,
  },
  rightColumn: {
    flex: 0.9,
  },
});

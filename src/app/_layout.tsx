import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SmokeProvider } from "@/context/SmokeContext";
import { useSmoke } from "@/hooks/useSmoke";
import { Onboarding } from "@/components/Onboarding";
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";

function RootContent() {
  const { settings, loading, error, retryLoad } = useSmoke();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>SmokeLog</Text>
        <Text style={styles.loadingSub}>Mindful Habit Reduction</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Database Load Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={retryLoad}>
          <Text style={styles.retryText}>Retry Loading</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!settings.isOnboarded) {
    return <Onboarding />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="light" />
    </>
  );
}

export default function RootLayout() {
  return (
    <SmokeProvider>
      <RootContent />
    </SmokeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0d0f12",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 4,
    marginTop: 20,
  },
  loadingSub: {
    color: "#6b7280",
    fontSize: 12,
    marginTop: 8,
    letterSpacing: 1,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#0d0f12",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorTitle: {
    color: "#ef4444",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  errorText: {
    color: "#9ca3af",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  retryText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});

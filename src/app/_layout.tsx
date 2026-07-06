import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SmokeProvider } from "@/context/SmokeContext";
import { useSmoke } from "@/hooks/useSmoke";
import { Onboarding } from "@/components/Onboarding";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import React from "react";

function RootContent() {
  const { settings, loading } = useSmoke();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
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
});

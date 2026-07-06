import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSmoke } from "@/hooks/useSmoke";
import { useResponsive } from "@/hooks/useResponsive";
import { TriggerBreakdown } from "@/components/history/TriggerBreakdown";
import { LogItem } from "@/components/history/LogItem";
import { EmptyLogsState } from "@/components/history/EmptyLogsState";

export default function HistoryScreen() {
  const { logs, evaluatedLogs, removeSmoke } = useSmoke();
  const { isMobile } = useResponsive();

  // Format date for list grouping
  const formatLogTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatLogDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Log",
      "Are you sure you want to remove this log? This will adjust your gap history.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await removeSmoke(id);
          },
        },
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Smoking Logs</Text>
      <Text style={styles.subtitle}>Trace and understand your triggers</Text>

      {/* Trigger Distribution Chart */}
      <TriggerBreakdown logs={logs} />

      {logs.length > 0 && <Text style={styles.sectionTitle}>Log History</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={evaluatedLogs}
        keyExtractor={(item) => item.log.id}
        renderItem={({ item }) => (
          <LogItem
            item={item}
            onDelete={handleDelete}
            formatLogTime={formatLogTime}
            formatLogDate={formatLogDate}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={EmptyLogsState}
        contentContainerStyle={[styles.listContainer, !isMobile && { alignSelf: "center", width: 600, maxWidth: "100%" }]}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0f12",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    marginTop: 20,
    marginBottom: 16,
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
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 12,
  },
});

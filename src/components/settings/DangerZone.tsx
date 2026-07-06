import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { AlertTriangle, RefreshCw } from "lucide-react-native";

interface DangerZoneProps {
  onReset: () => void;
}

export const DangerZone: React.FC<DangerZoneProps> = ({ onReset }) => {
  return (
    <View style={[styles.sectionCard, styles.dangerCard]}>
      <View style={styles.dangerHeader}>
        <AlertTriangle color="#ef4444" size={20} />
        <Text style={styles.dangerTitle}>Danger Zone</Text>
      </View>
      <Text style={styles.dangerDesc}>
        Performing these actions will wipe local cache and cannot be undone.
      </Text>

      <TouchableOpacity style={styles.resetBtn} onPress={onReset}>
        <RefreshCw color="#ef4444" size={16} />
        <Text style={styles.resetBtnText}>Clear All App Data</Text>
      </TouchableOpacity>
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
  dangerCard: {
    borderColor: "rgba(239, 68, 68, 0.2)",
    backgroundColor: "rgba(239, 68, 68, 0.02)",
  },
  dangerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  dangerTitle: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "bold",
  },
  dangerDesc: {
    color: "#9ca3af",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  resetBtn: {
    borderWidth: 1,
    borderColor: "#ef4444",
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  resetBtnText: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "bold",
  },
});

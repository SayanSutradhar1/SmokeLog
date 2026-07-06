import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { X, Star } from "lucide-react-native";

interface TriggerItem {
  id: string;
  label: string;
}

interface LogModalProps {
  visible: boolean;
  onClose: () => void;
  selectedTrigger: string;
  setSelectedTrigger: (id: string) => void;
  cravingStrength: number;
  setCravingStrength: (strength: number) => void;
  onSubmit: () => void;
  triggers: TriggerItem[];
}

export const LogModal: React.FC<LogModalProps> = ({
  visible,
  onClose,
  selectedTrigger,
  setSelectedTrigger,
  cravingStrength,
  setCravingStrength,
  onSubmit,
  triggers,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Mindful Log</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X color="#9ca3af" size={20} />
            </TouchableOpacity>
          </View>

          <ScrollView bounces={false} style={styles.modalForm}>
            <Text style={styles.modalSectionLabel}>WHAT WAS THE TRIGGER / CUE?</Text>
            <View style={styles.triggerGrid}>
              {triggers.map((trigger) => (
                <TouchableOpacity
                  key={trigger.id}
                  style={[
                    styles.triggerCard,
                    selectedTrigger === trigger.id && styles.activeTriggerCard,
                  ]}
                  onPress={() => setSelectedTrigger(trigger.id)}
                >
                  <Text
                    style={[
                      styles.triggerCardLabel,
                      selectedTrigger === trigger.id && styles.activeTriggerCardLabel,
                    ]}
                  >
                    {trigger.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalSectionLabel}>HOW STRONG WAS THE CRAVING? (1-5)</Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setCravingStrength(star)}>
                  <Star
                    size={32}
                    color={star <= cravingStrength ? "#f59e0b" : "#4b5563"}
                    fill={star <= cravingStrength ? "#f59e0b" : "transparent"}
                    style={styles.starIcon}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.frictionWarning}>
              <Text style={styles.frictionWarningText}>
                Note: Acknowledge this craving. You are choosing to smoke, but you are tracking it consciously.
              </Text>
            </View>

            <TouchableOpacity style={styles.modalSubmitBtn} onPress={onSubmit}>
              <Text style={styles.modalSubmitText}>Confirm and Log Smoke</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#111827",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "90%",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderBottomWidth: 0,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1f2937",
    alignItems: "center",
    justifyContent: "center",
  },
  modalForm: {
    width: "100%",
  },
  modalSectionLabel: {
    color: "#9ca3af",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 8,
  },
  triggerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  triggerCard: {
    backgroundColor: "#1f2937",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
    minWidth: "47%",
    flexGrow: 1,
    alignItems: "center",
  },
  activeTriggerCard: {
    borderColor: "#10b981",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  triggerCardLabel: {
    color: "#d1d5db",
    fontSize: 13,
    fontWeight: "500",
  },
  activeTriggerCardLabel: {
    color: "#10b981",
    fontWeight: "bold",
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
    marginVertical: 8,
  },
  starIcon: {
    marginHorizontal: 4,
  },
  frictionWarning: {
    backgroundColor: "rgba(245, 158, 11, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.15)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  frictionWarningText: {
    color: "#f59e0b",
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },
  modalSubmitBtn: {
    backgroundColor: "#10b981",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  modalSubmitText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
  },
});

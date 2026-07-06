import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SmokeLog, CravingSession, UserSettings } from "@/utils/storage";

interface AchievementsProps {
  logs: SmokeLog[];
  cravings: CravingSession[];
  secondsSinceLastSmoke: number | null;
  moneySaved: number;
  settings: UserSettings;
}

export const Achievements: React.FC<AchievementsProps> = ({
  logs,
  cravings,
  secondsSinceLastSmoke,
  moneySaved,
  settings,
}) => {
  const achievements = [
    {
      id: "first_step",
      title: "First Step",
      description: "Log your first cigarette to bring it into awareness.",
      unlocked: logs.length > 0,
      icon: "🌱",
    },
    {
      id: "craving_survivor",
      title: "Craving Survivor",
      description: "Complete a full 2-minute breathing deflection session.",
      unlocked: cravings.some((c) => c.completed),
      icon: "🧘",
    },
    {
      id: "gap_widener",
      title: "Gap Widener",
      description: "Widen the gap since your last smoke to over 3 hours.",
      unlocked:
        secondsSinceLastSmoke !== null && secondsSinceLastSmoke >= 10800,
      icon: "⏳",
    },
    {
      id: "pack_saver",
      title: "Pack Saver",
      description: `Save the cost of one full pack (${settings.currency}${settings.costPerPack}).`,
      unlocked: moneySaved >= settings.costPerPack,
      icon: "🪙",
    },
  ];

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Milestone Achievements</Text>
      <Text style={styles.sectionDesc}>Unlock badges by shifting your habits.</Text>

      <View style={styles.achievementGrid}>
        {achievements.map((badge) => (
          <View
            key={badge.id}
            style={[
              styles.achievementCard,
              badge.unlocked ? styles.unlockedCard : styles.lockedCard,
            ]}
          >
            <View
              style={[
                styles.badgeIconContainer,
                badge.unlocked ? styles.unlockedIconBg : styles.lockedIconBg,
              ]}
            >
              <Text style={styles.badgeEmoji}>{badge.icon}</Text>
            </View>
            <View style={styles.badgeInfo}>
              <Text style={[styles.badgeTitle, badge.unlocked ? styles.unlockedText : styles.lockedText]}>
                {badge.title}
              </Text>
              <Text style={styles.badgeDesc}>{badge.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1f2937",
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  sectionDesc: {
    color: "#6b7280",
    fontSize: 13,
    marginBottom: 20,
  },
  achievementGrid: {
    gap: 12,
  },
  achievementCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  unlockedCard: {
    backgroundColor: "rgba(16, 185, 129, 0.04)",
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  lockedCard: {
    backgroundColor: "rgba(31, 41, 55, 0.3)",
    borderColor: "#1f2937",
  },
  badgeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  unlockedIconBg: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
  },
  lockedIconBg: {
    backgroundColor: "#1f2937",
  },
  badgeEmoji: {
    fontSize: 22,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  unlockedText: {
    color: "#ffffff",
  },
  lockedText: {
    color: "#6b7280",
  },
  badgeDesc: {
    color: "#6b7280",
    fontSize: 11,
    lineHeight: 15,
  },
});

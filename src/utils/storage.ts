import AsyncStorage from "@react-native-async-storage/async-storage";

export interface SmokeLog {
  id: string;
  timestamp: number; // Unix timestamp in ms
  trigger: string; // 'stress' | 'boredom' | 'routine' | 'social' | 'craving' | 'other'
  cravingStrength: number; // 1 to 5
}

export interface UserSettings {
  cigarettesPerDay: number; // Baseline cigarettes per day
  costPerPack: number; // Price of a pack
  cigarettesPerPack: number; // Number of cigarettes in a pack (default 20)
  currency: string; // Currency symbol (e.g. '$', '₹', '£')
  reductionSpeed: "gentle" | "moderate" | "aggressive";
  isOnboarded: boolean;
  startDate: number; // Date they started using the app
}

export interface CravingSession {
  id: string;
  timestamp: number;
  durationSeconds: number;
  completed: boolean;
}

export class StorageManager {
  private static readonly LOGS_KEY = "@smokelog_logs";
  private static readonly SETTINGS_KEY = "@smokelog_settings";
  private static readonly CRAVINGS_KEY = "@smokelog_cravings";

  public static readonly defaultSettings: UserSettings = {
    cigarettesPerDay: 10,
    costPerPack: 15,
    cigarettesPerPack: 20,
    currency: "$",
    reductionSpeed: "moderate",
    isOnboarded: false,
    startDate: Date.now(),
  };

  public static async getSettings(): Promise<UserSettings> {
    try {
      const json = await AsyncStorage.getItem(this.SETTINGS_KEY);
      if (json) {
        const parsed = JSON.parse(json);
        return { ...this.defaultSettings, ...parsed };
      }
      return this.defaultSettings;
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      return this.defaultSettings;
    }
  }

  public static async saveSettings(settings: UserSettings): Promise<boolean> {
    try {
      await AsyncStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error("Failed to save settings:", error);
      return false;
    }
  }

  public static async getLogs(): Promise<SmokeLog[]> {
    try {
      const json = await AsyncStorage.getItem(this.LOGS_KEY);
      if (json) {
        const logs = JSON.parse(json) as SmokeLog[];
        // Return sorted by timestamp descending (newest first)
        return logs.sort((a, b) => b.timestamp - a.timestamp);
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch logs:", error);
      return [];
    }
  }

  public static async saveLogs(logs: SmokeLog[]): Promise<boolean> {
    try {
      await AsyncStorage.setItem(this.LOGS_KEY, JSON.stringify(logs));
      return true;
    } catch (error) {
      console.error("Failed to save logs:", error);
      return false;
    }
  }

  public static async addLog(log: Omit<SmokeLog, "id">): Promise<SmokeLog | null> {
    try {
      const logs = await this.getLogs();
      const newLog: SmokeLog = {
        ...log,
        id: Math.random().toString(36).substring(2, 9),
      };
      const updated = [newLog, ...logs];
      const success = await this.saveLogs(updated);
      return success ? newLog : null;
    } catch (error) {
      console.error("Failed to add log:", error);
      return null;
    }
  }

  public static async deleteLog(id: string): Promise<boolean> {
    try {
      const logs = await this.getLogs();
      const filtered = logs.filter((log) => log.id !== id);
      return await this.saveLogs(filtered);
    } catch (error) {
      console.error("Failed to delete log:", error);
      return false;
    }
  }

  public static async getCravingSessions(): Promise<CravingSession[]> {
    try {
      const json = await AsyncStorage.getItem(this.CRAVINGS_KEY);
      if (json) {
        return JSON.parse(json);
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch craving sessions:", error);
      return [];
    }
  }

  public static async addCravingSession(session: Omit<CravingSession, "id">): Promise<CravingSession | null> {
    try {
      const sessions = await this.getCravingSessions();
      const newSession: CravingSession = {
        ...session,
        id: Math.random().toString(36).substring(2, 9),
      };
      sessions.push(newSession);
      await AsyncStorage.setItem(this.CRAVINGS_KEY, JSON.stringify(sessions));
      return newSession;
    } catch (error) {
      console.error("Failed to add craving session:", error);
      return null;
    }
  }

  public static async clearAllData(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(this.LOGS_KEY);
      await AsyncStorage.removeItem(this.SETTINGS_KEY);
      await AsyncStorage.removeItem(this.CRAVINGS_KEY);
      return true;
    } catch (error) {
      console.error("Failed to clear data:", error);
      return false;
    }
  }
}

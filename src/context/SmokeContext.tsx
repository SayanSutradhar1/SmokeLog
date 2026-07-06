/* ESLint-disable react-hooks/exhaustive-deps */

import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from "react";
import {
  SmokeLog,
  UserSettings,
  CravingSession,
  StorageManager,
} from "../utils/storage";
import {
  GapAnalyzer,
  LogGapEvaluation,
  TrajectoryAnalysis,
  ImprovementStatus,
} from "../utils/gapAnalysis";

interface SmokeContextType {
  settings: UserSettings;
  logs: SmokeLog[];
  cravings: CravingSession[];
  loading: boolean;
  secondsSinceLastSmoke: number | null;
  targetGapSeconds: number; // The target gap for today
  progressToTarget: number; // 0 to 1
  addSmoke: (trigger: string, cravingStrength: number) => Promise<LogGapEvaluation | null>;
  removeSmoke: (id: string) => Promise<void>;
  saveUserSettings: (settings: UserSettings) => Promise<void>;
  logCravingSession: (durationSeconds: number, completed: boolean) => Promise<void>;
  resetAll: () => Promise<void>;
  // Health & Savings stats
  moneySaved: number;
  cigarettesSaved: number;
  healthProgress: {
    oxygen: number; // progress 0 to 100
    nicotine: number;
    cough: number;
    taste: number;
  };
  // Gap analysis stats
  lowestGap: number | null;
  highestGap: number | null;
  avgGap: number | null;
  evaluatedLogs: LogGapEvaluation[];
  trajectory: TrajectoryAnalysis;
}

export const SmokeContext = createContext<SmokeContextType | undefined>(undefined);

export const SmokeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(StorageManager.defaultSettings);
  const [logs, setLogs] = useState<SmokeLog[]>([]);
  const [cravings, setCravings] = useState<CravingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [secondsSinceLastSmoke, setSecondsSinceLastSmoke] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load all data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [storedSettings, storedLogs, storedCravings] = await Promise.all([
          StorageManager.getSettings(),
          StorageManager.getLogs(),
          StorageManager.getCravingSessions(),
        ]);

        setSettings(storedSettings);
        setLogs(storedLogs);
        setCravings(storedCravings);
      } catch (err) {
        console.error("Failed to load initial storage data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Update timer whenever logs change
  useEffect(() => {
    if (logs.length === 0) {
      setSecondsSinceLastSmoke(null);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const lastLog = logs[0]; // Sorted descending (newest first)
    const calculateSeconds = () => {
      const diffMs = Date.now() - lastLog.timestamp;
      setSecondsSinceLastSmoke(Math.max(0, Math.floor(diffMs / 1000)));
    };

    calculateSeconds(); // Initial run

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(calculateSeconds, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [logs]);

  // Calculate current target gap (in seconds)
  // Waking hours is set to 16 hours. Baseline gap is 16h divided by baseline cigarettes.
  const wakingHours = 16;
  const baselineGapSeconds = (wakingHours * 3600) / (settings.cigarettesPerDay || 1);

  // How many days has the user been using the app?
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  const daysActive = Math.max(
    1,
    Math.ceil((Date.now() - (settings.startDate || Date.now())) / millisecondsInDay)
  );

  // Gap increases based on speed settings
  // Gentle: 3% daily, Moderate: 7% daily, Aggressive: 15% daily
  const dailyRates = {
    gentle: 0.03,
    moderate: 0.07,
    aggressive: 0.15,
  };
  const rate = dailyRates[settings.reductionSpeed] || 0.07;
  // Dynamic target gap: baseline gap * (1 + rate * daysActive)
  const targetGapSeconds = Math.round(baselineGapSeconds * (1 + rate * (daysActive - 1)));

  // Progress towards target gap (capped at 1)
  const progressToTarget =
    secondsSinceLastSmoke === null
      ? 1
      : Math.min(1, secondsSinceLastSmoke / targetGapSeconds);

  // Memoize the GapAnalyzer instance to avoid memory churn and redundant sorting
  const analyzer = useMemo(() => new GapAnalyzer(logs), [logs]);
  const gapStats = useMemo(() => analyzer.calculateGaps(), [analyzer]);
  const evaluatedLogs = useMemo(() => analyzer.evaluateAllLogs(), [analyzer]);
  const trajectory = useMemo(() => analyzer.analyzeTrajectory(), [analyzer]);

  // LOG ACTION: Add a smoke
  const addSmoke = async (trigger: string, cravingStrength: number): Promise<LogGapEvaluation | null> => {
    const timestamp = Date.now();
    
    // Evaluate the new gap BEFORE adding it to the state/storage
    const existingLogs = [...logs];
    let evaluation: LogGapEvaluation | null = null;
    
    if (existingLogs.length > 0) {
      const newestLog = existingLogs[0];
      const gap = Math.max(0, Math.floor((timestamp - newestLog.timestamp) / 1000));
      const tempAnalyzer = new GapAnalyzer(existingLogs);
      const pastAnalysis = tempAnalyzer.calculateGaps();
      
      let status: ImprovementStatus = "initial";
      if (pastAnalysis.gaps.length > 0) {
        const maxGap = pastAnalysis.highestGap!;
        const avgGap = pastAnalysis.avgGap!;
        
        if (gap > maxGap) {
          status = "massive";
        } else if (gap > avgGap) {
          status = "improvement";
        } else {
          status = "bad";
        }
      }
      
      evaluation = {
        log: { id: "", timestamp, trigger, cravingStrength },
        gap,
        status,
        historicalAvg: pastAnalysis.avgGap,
        historicalMax: pastAnalysis.highestGap,
        historicalMin: pastAnalysis.lowestGap,
      };
    } else {
      evaluation = {
        log: { id: "", timestamp, trigger, cravingStrength },
        gap: null,
        status: "initial",
        historicalAvg: null,
        historicalMax: null,
        historicalMin: null,
      };
    }

    const newLog = await StorageManager.addLog({
      timestamp,
      trigger,
      cravingStrength,
    });
    
    if (newLog) {
      if (evaluation) {
        evaluation.log.id = newLog.id;
      }
      setLogs((prev) => [newLog, ...prev]);
    }
    
    return evaluation;
  };

  // LOG ACTION: Delete a smoke
  const removeSmoke = async (id: string) => {
    const success = await StorageManager.deleteLog(id);
    if (success) {
      setLogs((prev) => prev.filter((log) => log.id !== id));
    }
  };

  // SETTINGS ACTION: Save settings
  const saveUserSettings = async (newSettings: UserSettings) => {
    const success = await StorageManager.saveSettings(newSettings);
    if (success) {
      setSettings(newSettings);
    }
  };

  // CRAVING ACTION: Log mindfulness session
  const logCravingSession = async (durationSeconds: number, completed: boolean) => {
    const newSession = await StorageManager.addCravingSession({
      timestamp: Date.now(),
      durationSeconds,
      completed,
    });
    if (newSession) {
      setCravings((prev) => [...prev, newSession]);
    }
  };

  // RESET ACTION: Reset everything
  const resetAll = async () => {
    const success = await StorageManager.clearAllData();
    if (success) {
      setSettings(StorageManager.defaultSettings);
      setLogs([]);
      setCravings([]);
      setSecondsSinceLastSmoke(null);
    }
  };

  // Calculate Money Saved and Cigarettes Avoided
  // Cigarettes they would have smoked if they followed their old baseline:
  const oldExpectedSmokes = settings.cigarettesPerDay * daysActive;
  const actualSmokes = logs.length;
  // Cigarettes saved: expected minus actual (minimum 0 if they smoked more than baseline)
  const cigarettesSaved = Math.max(0, oldExpectedSmokes - actualSmokes);
  // Money saved = (cigarettes saved / cigarettes per pack) * cost per pack
  const pricePerCigarette = settings.costPerPack / (settings.cigarettesPerPack || 20);
  const moneySaved = Math.round(cigarettesSaved * pricePerCigarette * 100) / 100;

  // Calculate Health Progress based on elapsed time since last smoke
  const healthProgress = useMemo(() => {
    if (secondsSinceLastSmoke === null) {
      return { oxygen: 100, nicotine: 100, cough: 100, taste: 100 };
    }
    const hours = secondsSinceLastSmoke / 3600;

    return {
      oxygen: Math.min(100, Math.round((hours / 2) * 100)),
      nicotine: Math.min(100, Math.round((hours / 8) * 100)),
      cough: Math.min(100, Math.round((hours / 24) * 100)),
      taste: Math.min(100, Math.round((hours / 48) * 100)),
    };
  }, [secondsSinceLastSmoke]);

  return (
    <SmokeContext.Provider
      value={{
        settings,
        logs,
        cravings,
        loading,
        secondsSinceLastSmoke,
        targetGapSeconds,
        progressToTarget,
        addSmoke,
        removeSmoke,
        saveUserSettings,
        logCravingSession,
        resetAll,
        moneySaved,
        cigarettesSaved,
        healthProgress,
        lowestGap: gapStats.lowestGap,
        highestGap: gapStats.highestGap,
        avgGap: gapStats.avgGap,
        evaluatedLogs,
        trajectory,
      }}
    >
      {children}
    </SmokeContext.Provider>
  );
};

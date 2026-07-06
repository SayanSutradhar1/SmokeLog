import { SmokeLog } from "./storage";

export interface GapAnalysis {
  gaps: number[]; // in seconds, from oldest to newest
  lowestGap: number | null; // in seconds
  highestGap: number | null; // in seconds
  avgGap: number | null; // in seconds
}

export type ImprovementStatus = "massive" | "improvement" | "bad" | "initial";

export interface LogGapEvaluation {
  log: SmokeLog;
  gap: number | null; // in seconds (null if first log)
  status: ImprovementStatus;
  historicalAvg: number | null; // avg before this log
  historicalMax: number | null; // max before this log
  historicalMin: number | null; // min before this log
}

export interface TrajectoryAnalysis {
  status: "excellent" | "steady" | "slipping" | "insufficient";
  message: string;
  score: number; // 0 to 100
  recentAvgGap: number | null; // average of recent gaps
  historicalAvgGap: number | null; // average of historical gaps
}

export class GapAnalyzer {
  private logs: SmokeLog[];
  private chronologicalLogsCache: SmokeLog[] | null = null;
  private gapAnalysisCache: GapAnalysis | null = null;
  private evaluationsCache: LogGapEvaluation[] | null = null;
  private trajectoryCache: TrajectoryAnalysis | null = null;

  constructor(logs: SmokeLog[]) {
    this.logs = logs;
  }

  /**
   * Sort logs chronologically and cache the result.
   */
  private getChronologicalLogs(): SmokeLog[] {
    if (!this.chronologicalLogsCache) {
      this.chronologicalLogsCache = [...this.logs].sort((a, b) => a.timestamp - b.timestamp);
    }
    return this.chronologicalLogsCache;
  }

  /**
   * Calculates historical gaps between logs.
   * Returns gaps in chronological order (oldest gap to newest gap).
   */
  public calculateGaps(): GapAnalysis {
    if (this.gapAnalysisCache) return this.gapAnalysisCache;

    const chronological = this.getChronologicalLogs();
    if (chronological.length < 2) {
      this.gapAnalysisCache = {
        gaps: [],
        lowestGap: null,
        highestGap: null,
        avgGap: null,
      };
      return this.gapAnalysisCache;
    }

    const gaps: number[] = [];
    for (let i = 1; i < chronological.length; i++) {
      const diffSeconds = Math.max(0, Math.floor((chronological[i].timestamp - chronological[i - 1].timestamp) / 1000));
      gaps.push(diffSeconds);
    }

    const lowestGap = Math.min(...gaps);
    const highestGap = Math.max(...gaps);
    const avgGap = Math.round(gaps.reduce((sum, g) => sum + g, 0) / gaps.length);

    this.gapAnalysisCache = {
      gaps,
      lowestGap,
      highestGap,
      avgGap,
    };
    return this.gapAnalysisCache;
  }

  /**
   * Evaluates the status of each log by comparing its gap to the history before it.
   * Returns evaluated logs in the same order as input (newest-first).
   */
  public evaluateAllLogs(): LogGapEvaluation[] {
    if (this.evaluationsCache) return this.evaluationsCache;

    const chronological = this.getChronologicalLogs();
    const evaluations: LogGapEvaluation[] = [];

    for (let i = 0; i < chronological.length; i++) {
      const currentLog = chronological[i];
      
      // First log has no previous log, so no gap
      if (i === 0) {
        evaluations.push({
          log: currentLog,
          gap: null,
          status: "initial",
          historicalAvg: null,
          historicalMax: null,
          historicalMin: null,
        });
        continue;
      }

      const previousLog = chronological[i - 1];
      const gap = Math.max(0, Math.floor((currentLog.timestamp - previousLog.timestamp) / 1000));

      // Get logs that occurred before the current log
      const pastLogs = chronological.slice(0, i);
      const subAnalyzer = new GapAnalyzer(pastLogs);
      // Skip redundant sorting inside sub-analyzer
      subAnalyzer.chronologicalLogsCache = pastLogs;
      const pastAnalysis = subAnalyzer.calculateGaps();

      let status: ImprovementStatus = "initial";

      if (pastAnalysis.gaps.length === 0) {
        status = "initial";
      } else {
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

      evaluations.push({
        log: currentLog,
        gap,
        status,
        historicalAvg: pastAnalysis.avgGap,
        historicalMax: pastAnalysis.highestGap,
        historicalMin: pastAnalysis.lowestGap,
      });
    }

    this.evaluationsCache = evaluations.reverse();
    return this.evaluationsCache;
  }

  /**
   * Analyzes the user's trajectory to deduce whether they are successfully changing their habit.
   */
  public analyzeTrajectory(): TrajectoryAnalysis {
    if (this.trajectoryCache) return this.trajectoryCache;

    if (this.logs.length < 3) {
      this.trajectoryCache = {
        status: "insufficient",
        message: "Keep tracking! We need at least 3 logs to calculate your progress trajectory.",
        score: 50,
        recentAvgGap: null,
        historicalAvgGap: null,
      };
      return this.trajectoryCache;
    }

    // Get chronological gaps
    const { gaps } = this.calculateGaps();
    
    if (gaps.length === 0) {
      this.trajectoryCache = {
        status: "insufficient",
        message: "Add more logs to start analyzing your behavior.",
        score: 50,
        recentAvgGap: null,
        historicalAvgGap: null,
      };
      return this.trajectoryCache;
    }

    // Split gaps into recent (last 3 gaps) and historical (older gaps)
    const recentCount = Math.min(3, Math.ceil(gaps.length / 2));
    const recentGaps = gaps.slice(-recentCount);
    const historicalGaps = gaps.slice(0, gaps.length - recentCount);

    const recentAvg = recentGaps.reduce((s, g) => s + g, 0) / recentGaps.length;
    const historicalAvg = historicalGaps.length > 0 
      ? historicalGaps.reduce((s, g) => s + g, 0) / historicalGaps.length 
      : recentAvg; // Fallback if not enough gaps

    // Evaluate the status breakdown of recent logs
    const evals = this.evaluateAllLogs();
    const recentEvals = evals.slice(0, Math.min(5, evals.length)); // newest first
    
    let massiveCount = 0;
    let improvementCount = 0;
    let badCount = 0;
    
    recentEvals.forEach(e => {
      if (e.status === "massive") massiveCount++;
      else if (e.status === "improvement") improvementCount++;
      else if (e.status === "bad") badCount++;
    });

    // Calculate score out of 100 based on gap ratio and status of recent logs
    const gapRatio = historicalAvg > 0 ? recentAvg / historicalAvg : 1;
    
    // Base score from gap ratio (capped between 20 and 80)
    let score = 50;
    if (gapRatio > 1) {
      score += Math.min(30, (gapRatio - 1) * 60); // reward up to +30 points
    } else {
      score -= Math.min(30, (1 - gapRatio) * 60); // penalize up to -30 points
    }

    // Adjust score based on recent log statuses
    // Massive: +8 points, Improvement: +4 points, Bad: -6 points
    score += massiveCount * 8 + improvementCount * 4 - badCount * 6;
    score = Math.max(0, Math.min(100, Math.round(score)));

    let status: "excellent" | "steady" | "slipping" = "steady";
    let message = "";

    if (score >= 75) {
      status = "excellent";
      message = "Fantastic job! Your gaps are widening significantly, showing high control over triggers. You are on the correct path to changing your habit!";
    } else if (score >= 45) {
      status = "steady";
      message = "You are maintaining a steady pace. Keep pushing yourself to wait a bit longer before each log to improve your average gap.";
    } else {
      status = "slipping";
      message = "Your gaps are getting shorter. Triggers are getting the better of you. Try using the 'Survive Craving' exercise to delay your next cigarette!";
    }

    this.trajectoryCache = {
      status,
      message,
      score,
      recentAvgGap: Math.round(recentAvg),
      historicalAvgGap: Math.round(historicalAvg),
    };
    return this.trajectoryCache;
  }
}

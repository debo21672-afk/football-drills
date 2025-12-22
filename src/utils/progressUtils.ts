export interface SessionData {
  id: string;
  exerciseId: string;
  score: number;
  duration: number;
  timestamp: number;
  date: string;
}

export interface LevelProgress {
  levelId: number;
  completedExercises: number;
  totalExercises: number;
  bestScores: { [exerciseId: string]: number };
  attempts: { [exerciseId: string]: number[] };
}

export interface UserSettings {
  soundEnabled: boolean;
  darkMode: boolean;
  defaultTimerDuration: number;
  videoSpeed: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: string | null;
  totalSessions: number;
}

export interface AppData {
  progress: { [levelId: number]: LevelProgress };
  settings: UserSettings;
  streak: StreakData;
  sessions: SessionData[];
}

const PROGRESS_KEY = 'footballAppProgress';
const SETTINGS_KEY = 'footballAppSettings';
const STREAK_KEY = 'footballAppStreak';
const SESSIONS_KEY = 'footballAppSessions';

export const defaultSettings: UserSettings = {
  soundEnabled: true,
  darkMode: false,
  defaultTimerDuration: 60,
  videoSpeed: 1,
};

const defaultStreak: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastSessionDate: null,
  totalSessions: 0,
};

// Progress functions
export const getProgress = (): { [levelId: number]: LevelProgress } => {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

export const saveProgress = (progress: { [levelId: number]: LevelProgress }): void => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
};

// Settings functions
export const getSettings = (): UserSettings => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
};

export const saveSettings = (settings: UserSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// Streak functions
export const getStreakData = (): StreakData => {
  try {
    const saved = localStorage.getItem(STREAK_KEY);
    return saved ? { ...defaultStreak, ...JSON.parse(saved) } : defaultStreak;
  } catch {
    return defaultStreak;
  }
};

export const updateStreak = (): StreakData => {
  const streak = getStreakData();
  const today = new Date().toISOString().split('T')[0];
  
  if (streak.lastSessionDate === today) {
    return streak;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  if (streak.lastSessionDate === yesterdayStr) {
    streak.currentStreak += 1;
  } else if (streak.lastSessionDate !== today) {
    streak.currentStreak = 1;
  }
  
  streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
  streak.lastSessionDate = today;
  streak.totalSessions += 1;
  
  localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
  return streak;
};

// Session functions
export const getSessions = (): SessionData[] => {
  try {
    const saved = localStorage.getItem(SESSIONS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const addSession = (exerciseId: string, score: number, duration: number): SessionData => {
  const sessions = getSessions();
  const session: SessionData = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    exerciseId,
    score,
    duration,
    timestamp: Date.now(),
    date: new Date().toISOString().split('T')[0],
  };
  
  sessions.push(session);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  
  // Update streak
  updateStreak();
  
  // Update progress with attempt
  const progress = getProgress();
  const [levelId] = exerciseId.split('-');
  const levelNum = parseInt(levelId);
  
  if (!progress[levelNum]) {
    progress[levelNum] = {
      levelId: levelNum,
      completedExercises: 0,
      totalExercises: 7,
      bestScores: {},
      attempts: {},
    };
  }
  
  if (!progress[levelNum].attempts) {
    progress[levelNum].attempts = {};
  }
  
  if (!progress[levelNum].attempts[exerciseId]) {
    progress[levelNum].attempts[exerciseId] = [];
  }
  
  progress[levelNum].attempts[exerciseId].push(score);
  saveProgress(progress);
  
  return session;
};

// Exercise stats
export interface ExerciseStats {
  attempts: number;
  bestScore: number;
  averageScore: number;
  recentScores: number[];
  improvementPercentage: number;
}

export const getExerciseStats = (exerciseId: string): ExerciseStats => {
  const progress = getProgress();
  const [levelId] = exerciseId.split('-');
  const levelNum = parseInt(levelId);
  
  const levelProgress = progress[levelNum];
  
  if (!levelProgress || !levelProgress.attempts || !levelProgress.attempts[exerciseId]) {
    return {
      attempts: 0,
      bestScore: 0,
      averageScore: 0,
      recentScores: [],
      improvementPercentage: 0,
    };
  }
  
  const scores = levelProgress.attempts[exerciseId];
  const recentScores = scores.slice(-10);
  const bestScore = levelProgress.bestScores[exerciseId] || Math.max(...scores);
  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  // Calculate improvement: compare first 3 attempts average to last 3 attempts average
  let improvementPercentage = 0;
  if (scores.length >= 6) {
    const firstThree = scores.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
    const lastThree = scores.slice(-3).reduce((a, b) => a + b, 0) / 3;
    if (firstThree > 0) {
      improvementPercentage = ((lastThree - firstThree) / firstThree) * 100;
    }
  }
  
  return {
    attempts: scores.length,
    bestScore,
    averageScore: Math.round(averageScore * 10) / 10,
    recentScores,
    improvementPercentage: Math.round(improvementPercentage),
  };
};

// Total stats
export interface TotalStats {
  totalStars: number;
  totalSessions: number;
  completionPercentage: number;
  totalExercisesCompleted: number;
  totalExercises: number;
}

export const getTotalStats = (): TotalStats => {
  const progress = getProgress();
  const streak = getStreakData();
  
  let totalStars = 0;
  let totalExercisesCompleted = 0;
  const totalExercises = 10 * 7; // 10 levels, 7 exercises each
  
  Object.values(progress).forEach((level) => {
    totalExercisesCompleted += level.completedExercises;
    
    // Calculate stars based on scores (simplified: 1 star per completed exercise)
    Object.values(level.bestScores).forEach((score) => {
      if (score > 0) totalStars += 1;
      if (score >= 10) totalStars += 1;
      if (score >= 20) totalStars += 1;
    });
  });
  
  const completionPercentage = Math.round((totalExercisesCompleted / totalExercises) * 100);
  
  return {
    totalStars,
    totalSessions: streak.totalSessions,
    completionPercentage,
    totalExercisesCompleted,
    totalExercises,
  };
};

// Export/Import functions
export const exportData = (): string => {
  const data: AppData = {
    progress: getProgress(),
    settings: getSettings(),
    streak: getStreakData(),
    sessions: getSessions(),
  };
  return JSON.stringify(data, null, 2);
};

export const importData = (jsonString: string): boolean => {
  try {
    const data: AppData = JSON.parse(jsonString);
    
    if (data.progress) {
      saveProgress(data.progress);
    }
    if (data.settings) {
      saveSettings(data.settings);
    }
    if (data.streak) {
      localStorage.setItem(STREAK_KEY, JSON.stringify(data.streak));
    }
    if (data.sessions) {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(data.sessions));
    }
    
    return true;
  } catch {
    return false;
  }
};

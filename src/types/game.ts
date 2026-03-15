/** Identifies which team a player belongs to */
export type TeamId = 1 | 2;

/** Difficulty preset for question generation */
export type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';

/** Supported math operators */
export type Operator = '+' | '-' | '×' | '÷';

/** Controls which operators appear in generated questions */
export type OperatorMode = Operator | 'mixed';

/** Game mode: classic (pull to win zone) or timed rush */
export type GameMode = 'classic' | 'rush-30' | 'rush-60';

/** Outcome of a completed round */
export type RoundResult = TeamId | 'tie' | null;

/** Available visual themes */
export type ThemeId = 'classic' | 'space' | 'dino' | 'soccer';

/** Grade-based preset identifiers */
export type PresetId =
  | 'grade2-warmup'
  | 'grade2-mixed'
  | 'grade3-facts'
  | 'grade3-rush'
  | 'grade4-challenge'
  | 'grade5-battle';

/** Rule-based constraints for question generation */
export interface QuestionRules {
  minNumber: number;
  maxNumber: number;
  allowedOperators: Operator[];
  /** Allow carrying/borrowing (regrouping) in addition/subtraction */
  allowRegrouping: boolean;
  /** Division must produce whole-number results */
  requireWholeNumberDivision: boolean;
  /** Allow negative answers (subtraction where b > a) */
  allowNegatives: boolean;
}

/** Full preset configuration */
export interface PresetConfig {
  id: PresetId;
  label: string;
  description: string;
  difficulty: Difficulty;
  operatorMode: OperatorMode;
  gameMode: GameMode;
  winZone: number;
  themeId: ThemeId;
  questionRules: QuestionRules;
}

// ── Theme configuration ─────────────────────────────────────────────

/** Tailwind class strings for a single team's visuals */
export interface TeamColors {
  bg: string;
  bgLight: string;
  hover: string;
  accent: string;
  text: string;
  label: string;
  /** Dot color in scoreboard */
  dot: string;
  /** Label color in scoreboard */
  scoreLabel: string;
  /** Win-zone rgba base (used for dynamic opacity in TugArena) */
  winZoneRgb: string;
  /** Knot / glow rgb for TugArena marker */
  knotRgb: string;
  knotBorderRgb: string;
  knotGlowRgba: string;
  /** Victory overlay gradient + glow */
  victoryGlow: string;
  victoryGradient: string;
  victoryBorder: string;
  /** Status badge in scoreboard */
  statusBg: string;
  statusText: string;
}

/** Full theme configuration */
export interface ThemeConfig {
  id: ThemeId;
  label: string;
  /** Emoji shown in theme selector */
  icon: string;
  /** App shell background */
  appBg: string;
  /** Scoreboard bar background */
  scoreboardBg: string;
  /** Controls bar background */
  controlsBg: string;
  /** TugArena background gradient */
  arenaBg: string;
  /** Arena title text color */
  arenaTitle: string;
  /** Arena center-line dash color */
  arenaCenterLine: string;
  /** Arena center dot */
  arenaCenterDot: string;
  arenaCenterDotBorder: string;
  /** Rope gradient classes */
  ropeGradient: string;
  ropeBorder: string;
  ropeTexture: string;
  /** Flag gradient + text */
  flagGradient: string;
  flagBorder: string;
  flagText: string;
  /** Step indicator center dot */
  stepCenter: string;
  /** Team-specific colors */
  team1: TeamColors;
  team2: TeamColors;
  /** Victory overlay tie variant */
  tieGlow: string;
  tieGradient: string;
  tieBorder: string;
  /** Labels */
  team1WinLabel: string;
  team2WinLabel: string;
  winSubtitle: string;
  tieTitle: string;
  tieSubtitle: string;
  /** Icons for victory */
  winIcon: string;
  tieIcon: string;
}

/** Configuration object for question generation */
export interface QuestionConfig {
  difficulty?: Difficulty;
  operatorMode?: OperatorMode;
  rules?: QuestionRules;
}

/** A generated math problem with its computed answer */
export interface MathQuestion {
  a: number;
  b: number;
  operator: Operator;
  answer: number;
  display: string;
}

/** Per-round questions keyed by team */
export interface TeamQuestions {
  team1: MathQuestion;
  team2: MathQuestion;
}

/** Cumulative score tracker */
export interface GameScore {
  team1: number;
  team2: number;
}

/** Per-team streak counts */
export interface Streaks {
  team1: number;
  team2: number;
}

/** Props for the TeamPanel component */
export interface TeamPanelProps {
  team: TeamId;
  question: MathQuestion;
  onCorrectAnswer: () => void;
  onWrongAnswer: () => void;
  onKeypadTap: () => void;
  disabled: boolean;
  score: number;
  streak: number;
  colors: TeamColors;
}

/** Props for the TugArena component */
export interface TugArenaProps {
  position: number;
  winZone: number;
  theme: ThemeConfig;
}

/** Props for the GameControls component */
export interface GameControlsProps {
  presetId: PresetId;
  difficulty: Difficulty;
  operatorMode: OperatorMode;
  gameMode: GameMode;
  themeId: ThemeId;
  soundEnabled: boolean;
  onPresetChange: (p: PresetId) => void;
  onDifficultyChange: (d: Difficulty) => void;
  onOperatorModeChange: (o: OperatorMode) => void;
  onGameModeChange: (m: GameMode) => void;
  onThemeChange: (t: ThemeId) => void;
  onSoundToggle: () => void;
  onNewRound: () => void;
  onResetAll: () => void;
}

/** Props for the ScoreBoard component */
export interface ScoreBoardProps {
  score: GameScore;
  presetLabel: string;
  difficulty: Difficulty;
  operatorMode: OperatorMode;
  gameMode: GameMode;
  roundResult: RoundResult;
  timeLeft: number | null;
  theme: ThemeConfig;
}

/** Props for the VictoryOverlay component */
export interface VictoryOverlayProps {
  result: RoundResult;
  onPlayAgain: () => void;
  onResetScores: () => void;
  theme: ThemeConfig;
}

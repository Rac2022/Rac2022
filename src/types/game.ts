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
  allowRegrouping: boolean;
  requireWholeNumberDivision: boolean;
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

/** A custom question provided by the teacher */
export interface CustomQuestion {
  display: string;
  answer: number;
}

/** Persisted game settings */
export interface GameSettings {
  presetId: PresetId;
  themeId: ThemeId;
  gameMode: GameMode;
  difficulty: Difficulty;
  operatorMode: OperatorMode;
  winZone: number;
  soundEnabled: boolean;
  customQuestionsText: string;
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
  dot: string;
  scoreLabel: string;
  winZoneRgb: string;
  knotRgb: string;
  knotBorderRgb: string;
  knotGlowRgba: string;
  victoryGlow: string;
  victoryGradient: string;
  victoryBorder: string;
  statusBg: string;
  statusText: string;
}

/** Full theme configuration */
export interface ThemeConfig {
  id: ThemeId;
  label: string;
  icon: string;
  appBg: string;
  scoreboardBg: string;
  controlsBg: string;
  arenaBg: string;
  arenaTitle: string;
  arenaCenterLine: string;
  arenaCenterDot: string;
  arenaCenterDotBorder: string;
  ropeGradient: string;
  ropeBorder: string;
  ropeTexture: string;
  flagGradient: string;
  flagBorder: string;
  flagText: string;
  stepCenter: string;
  team1: TeamColors;
  team2: TeamColors;
  /** Team avatar icons (emoji) */
  team1Icon: string;
  team2Icon: string;
  tieGlow: string;
  tieGradient: string;
  tieBorder: string;
  team1WinLabel: string;
  team2WinLabel: string;
  winSubtitle: string;
  tieTitle: string;
  tieSubtitle: string;
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

// ── Component props ─────────────────────────────────────────────────

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
  teamIcon: string;
  allowNegatives?: boolean;
}

export interface TugArenaProps {
  position: number;
  winZone: number;
  theme: ThemeConfig;
}

export interface GameControlsProps {
  soundEnabled: boolean;
  onSoundToggle: () => void;
  onNewRound: () => void;
  onResetAll: () => void;
  onOpenSetup: () => void;
  onBackToLobby: () => void;
}

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

export interface VictoryOverlayProps {
  result: RoundResult;
  onPlayAgain: () => void;
  onResetScores: () => void;
  theme: ThemeConfig;
}

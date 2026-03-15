/** Identifies which team a player belongs to */
export type TeamId = 1 | 2;

/** Difficulty preset for question generation */
export type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';

/** Supported math operators */
export type Operator = '+' | '-' | '×' | '÷';

/** Controls which operators appear in generated questions */
export type OperatorMode = Operator | 'mixed';

/** Configuration object for question generation */
export interface QuestionConfig {
  difficulty?: Difficulty;
  operatorMode?: OperatorMode;
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

/** Props for the TeamPanel component */
export interface TeamPanelProps {
  team: TeamId;
  question: MathQuestion;
  onCorrectAnswer: () => void;
  disabled: boolean;
  score: number;
}

/** Props for the TugArena component */
export interface TugArenaProps {
  /** Negative = Team 1 leading, Positive = Team 2 leading */
  position: number;
  winZone: number;
}

/** Props for the GameControls component */
export interface GameControlsProps {
  difficulty: Difficulty;
  operatorMode: OperatorMode;
  onDifficultyChange: (d: Difficulty) => void;
  onOperatorModeChange: (o: OperatorMode) => void;
  onNewRound: () => void;
  onResetAll: () => void;
}

/** Props for the ScoreBoard component */
export interface ScoreBoardProps {
  score: GameScore;
  difficulty: Difficulty;
  operatorMode: OperatorMode;
  winner: TeamId | null;
}

/** Props for the VictoryOverlay component */
export interface VictoryOverlayProps {
  winner: TeamId;
  onPlayAgain: () => void;
  onResetScores: () => void;
}

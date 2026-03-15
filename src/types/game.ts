/** Identifies which team a player belongs to */
export type TeamId = 1 | 2;

/** A generated math problem with its computed answer */
export interface MathQuestion {
  a: number;
  b: number;
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

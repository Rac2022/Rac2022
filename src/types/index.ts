// ===== CE Strategy Snapshot — Type Definitions =====

export type Profession = 'PT' | 'OT' | 'SLP';

export type RenewalTimeline =
  | 'within-30'
  | '31-to-90'
  | '3-to-6-months'
  | 'over-6-months'
  | 'not-sure';

export type CEApproach =
  | 'individual'
  | 'mixed-vendors'
  | 'manual-adhoc'
  | 'centralized';

export type TrackingMethod =
  | 'manual-spreadsheets'
  | 'manager-oversight'
  | 'limited-dashboard'
  | 'centralized-dashboard';

export type ConfidenceLevel =
  | 'very-confident'
  | 'mostly-confident'
  | 'not-fully-sure'
  | 'concerned';

export type Goal =
  | 'compliance'
  | 'reduce-admin'
  | 'engagement'
  | 'live-education'
  | 'specialty-education'
  | 'standardize-planning';

export type Format =
  | 'on-demand'
  | 'live-webinars'
  | 'private-webinars'
  | 'private-in-person';

export type Specialty =
  | 'orthopedics'
  | 'neuro'
  | 'pelvic-health'
  | 'pediatrics'
  | 'behavioral-health'
  | 'general-rehab';

export type YesNoMaybe = 'yes' | 'no' | 'not-sure' | 'maybe' | 'somewhat' | 'not-really';

// ===== Input Steps =====

export interface TeamProfile {
  teamSize: number;
  professions: Profession[];
  state: string;
  renewalTimeline: RenewalTimeline;
}

export interface CurrentSetup {
  ceApproach: CEApproach;
  trackingMethod: TrackingMethod;
  confidenceLevel: ConfidenceLevel;
}

export interface Priorities {
  goals: Goal[];
  formats: Format[];
  specialties: Specialty[];
}

export interface LiveSupport {
  needsLiveHours: 'yes' | 'no' | 'not-sure';
  teamEventsValuable: 'yes' | 'maybe' | 'no';
  centralizedVisibility: 'yes' | 'somewhat' | 'not-really';
}

export interface SnapshotInput {
  teamProfile: TeamProfile;
  currentSetup: CurrentSetup;
  priorities: Priorities;
  liveSupport: LiveSupport;
}

// ===== Results =====

export type RiskLevel = 'Low' | 'Moderate' | 'High';

export type ValueBand = 'Limited' | 'Moderate' | 'Strong' | 'High Potential';

export type RecommendationPath =
  | 'centralized-subscription'
  | 'subscription-live-webinar'
  | 'subscription-private-webinar'
  | 'subscription-private-inperson'
  | 'specialty-blended'
  | 'maintain-tighten';

export interface BlindSpot {
  text: string;
}

export interface AdminBurden {
  level: RiskLevel;
  bullets: string[];
}

export interface FragmentationRisk {
  level: RiskLevel;
  explanation: string;
}

export interface Recommendation {
  path: RecommendationPath;
  title: string;
  rationale: string;
  bullets: string[];
  whyFit: string;
}

export interface ValueCard {
  label: string;
  band: ValueBand;
  note: string;
}

export interface ComparisonRow {
  dimension: string;
  current: string;
  centralized: string;
}

export interface NextStep {
  text: string;
}

export interface SnapshotResult {
  input: SnapshotInput;
  urgencyLabel: string;
  liveRelevant: boolean;
  blindSpots: BlindSpot[];
  adminBurden: AdminBurden;
  fragmentationRisk: FragmentationRisk;
  recommendation: Recommendation;
  valueCards: ValueCard[];
  comparison: ComparisonRow[];
  nextStep: NextStep;
}

// ===== State Config =====

export interface StateConfig {
  label: string;
  abbreviation: string;
  renewalNote: string;
  liveHoursRelevant: boolean;
  resultNote: string;
}

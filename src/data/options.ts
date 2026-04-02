// ===== Dropdown & multi-select option labels =====
// Centralised here so the stepper and results can share display labels.

export const renewalTimelineLabels: Record<string, string> = {
  'within-30': 'Within 30 days',
  '31-to-90': '31–90 days',
  '3-to-6-months': '3–6 months',
  'over-6-months': 'Over 6 months',
  'not-sure': 'Not sure',
};

export const ceApproachLabels: Record<string, string> = {
  individual: 'Individual purchases',
  'mixed-vendors': 'Mixed vendors',
  'manual-adhoc': 'Mostly manual / ad hoc',
  centralized: 'Centralized solution already in place',
};

export const trackingMethodLabels: Record<string, string> = {
  'manual-spreadsheets': 'Manual spreadsheets',
  'manager-oversight': 'Manager oversight',
  'limited-dashboard': 'Limited dashboard / partial visibility',
  'centralized-dashboard': 'Centralized dashboard',
};

export const confidenceLevelLabels: Record<string, string> = {
  'very-confident': 'Very confident',
  'mostly-confident': 'Mostly confident',
  'not-fully-sure': 'Not fully sure',
  concerned: 'Concerned about gaps',
};

export const goalLabels: Record<string, string> = {
  compliance: 'Stay compliant',
  'reduce-admin': 'Reduce admin burden',
  engagement: 'Improve team engagement',
  'live-education': 'Support live education needs',
  'specialty-education': 'Expand specialty education',
  'standardize-planning': 'Standardize CE planning',
};

export const formatLabels: Record<string, string> = {
  'on-demand': 'On-demand learning',
  'live-webinars': 'Live webinars',
  'private-webinars': 'Private webinars',
  'private-in-person': 'Private in-person events',
};

export const specialtyLabels: Record<string, string> = {
  orthopedics: 'Orthopedics',
  neuro: 'Neuro',
  'pelvic-health': 'Pelvic Health',
  pediatrics: 'Pediatrics',
  'behavioral-health': 'Behavioral Health',
  'general-rehab': 'General Rehab Topics',
};

import {
  SnapshotInput,
  RiskLevel,
  AdminBurden,
  FragmentationRisk,
  BlindSpot,
} from '@/types';

// ===== Admin Burden Scoring =====
// Scores 0-10 based on team size, tracking method, CE approach, visibility, urgency.
// Thresholds: 0-3 Low, 4-6 Moderate, 7+ High
// Adjust thresholds here to tune sensitivity.

export function scoreAdminBurden(input: SnapshotInput): AdminBurden {
  let score = 0;
  const bullets: string[] = [];
  const { teamProfile, currentSetup, liveSupport } = input;

  // Team size factor
  if (teamProfile.teamSize >= 20) {
    score += 3;
    bullets.push('Larger teams typically create more coordination overhead.');
  } else if (teamProfile.teamSize >= 10) {
    score += 2;
    bullets.push('Mid-size teams often face moderate tracking complexity.');
  } else {
    score += 1;
  }

  // Tracking method
  if (currentSetup.trackingMethod === 'manual-spreadsheets') {
    score += 3;
    bullets.push('Manual spreadsheets may increase the risk of missed renewals or incomplete records.');
  } else if (currentSetup.trackingMethod === 'manager-oversight') {
    score += 2;
    bullets.push('Manager-only oversight can create bottlenecks as team size grows.');
  } else if (currentSetup.trackingMethod === 'limited-dashboard') {
    score += 1;
  }

  // CE approach
  if (currentSetup.ceApproach === 'manual-adhoc') {
    score += 2;
  } else if (currentSetup.ceApproach === 'mixed-vendors') {
    score += 1;
  }

  // Visibility
  if (liveSupport.centralizedVisibility === 'yes' && currentSetup.trackingMethod !== 'centralized-dashboard') {
    score += 1;
    bullets.push('There may be a gap between desired visibility and current tracking capability.');
  }

  // Urgency
  if (teamProfile.renewalTimeline === 'within-30') {
    score += 1;
  }

  const level: RiskLevel = score <= 3 ? 'Low' : score <= 6 ? 'Moderate' : 'High';

  // Ensure at least 2 bullets
  if (bullets.length < 2) {
    if (level === 'Low') {
      bullets.push('Current setup appears relatively streamlined for admin purposes.');
    } else {
      bullets.push('Centralizing CE oversight may help reduce planning effort over time.');
    }
  }

  return { level, bullets: bullets.slice(0, 3) };
}

// ===== Fragmentation Risk Scoring =====
// Scores 0-10. Thresholds same as above.

export function scoreFragmentationRisk(input: SnapshotInput): FragmentationRisk {
  let score = 0;
  const { currentSetup, priorities } = input;

  if (currentSetup.ceApproach === 'individual') score += 3;
  else if (currentSetup.ceApproach === 'mixed-vendors') score += 2;
  else if (currentSetup.ceApproach === 'manual-adhoc') score += 2;

  if (priorities.formats.length >= 3) score += 2;
  else if (priorities.formats.length >= 2) score += 1;

  if (currentSetup.confidenceLevel === 'concerned') score += 2;
  else if (currentSetup.confidenceLevel === 'not-fully-sure') score += 1;

  if (priorities.specialties.length >= 3) score += 2;
  else if (priorities.specialties.length >= 2) score += 1;

  if (currentSetup.trackingMethod === 'manual-spreadsheets' || currentSetup.trackingMethod === 'manager-oversight') {
    score += 1;
  }

  const level: RiskLevel = score <= 3 ? 'Low' : score <= 6 ? 'Moderate' : 'High';

  const explanations: Record<RiskLevel, string> = {
    Low: 'Your current setup appears relatively consolidated. Fragmentation risk looks manageable at this stage.',
    Moderate: 'There are signs that CE resources may be spread across multiple sources, which can create gaps in tracking and consistency over time.',
    High: 'Multiple vendors, formats, and specialty needs suggest a fragmented CE landscape. Consolidating may help reduce blind spots and simplify planning.',
  };

  return { level, explanation: explanations[level] };
}

// ===== Blind Spots =====
// Generate 3-5 contextual bullets based on inputs.

export function generateBlindSpots(input: SnapshotInput): BlindSpot[] {
  const spots: BlindSpot[] = [];
  const { teamProfile, currentSetup, priorities, liveSupport } = input;

  if (priorities.formats.length >= 2) {
    spots.push({ text: 'Tracking CE across multiple formats may be creating unnecessary admin overhead.' });
  }

  if (currentSetup.trackingMethod === 'manual-spreadsheets' || currentSetup.trackingMethod === 'manager-oversight') {
    spots.push({ text: 'Teams with manual oversight often discover gaps late in the renewal cycle.' });
  }

  if (liveSupport.needsLiveHours === 'yes' && teamProfile.renewalTimeline !== 'over-6-months') {
    spots.push({ text: 'Live education support may be worth planning earlier rather than waiting until deadlines are close.' });
  }

  if (priorities.specialties.length >= 2) {
    spots.push({ text: 'Specialty learning demand may be outgrowing a one-size-fits-all CE approach.' });
  }

  if (liveSupport.centralizedVisibility === 'yes' && currentSetup.trackingMethod !== 'centralized-dashboard') {
    spots.push({ text: 'Limited visibility can make it harder to standardize progress across clinicians.' });
  }

  if (currentSetup.confidenceLevel === 'concerned' || currentSetup.confidenceLevel === 'not-fully-sure') {
    spots.push({ text: 'Uncertainty about current CE coverage could signal hidden compliance risk worth reviewing.' });
  }

  if (teamProfile.teamSize >= 15 && currentSetup.ceApproach !== 'centralized') {
    spots.push({ text: 'Larger teams without centralized CE access may have inconsistent learning experiences across clinicians.' });
  }

  if (liveSupport.teamEventsValuable === 'yes' && !priorities.formats.includes('private-in-person') && !priorities.formats.includes('private-webinars')) {
    spots.push({ text: 'Interest in team-based events may not be reflected in current format planning.' });
  }

  // Return 3–5 spots
  return spots.slice(0, 5).length >= 3 ? spots.slice(0, 5) : [
    ...spots,
    { text: 'A quick audit of remaining CE needs per clinician may surface planning opportunities.' },
    { text: 'Reviewing format requirements by state may help avoid last-minute adjustments.' },
  ].slice(0, Math.max(3, spots.length));
}

// ===== Urgency Label =====

export function getUrgencyLabel(timeline: string): string {
  switch (timeline) {
    case 'within-30': return 'Urgent — renewals approaching soon';
    case '31-to-90': return 'Near-term — planning window is open';
    case '3-to-6-months': return 'Moderate — good time to plan ahead';
    case 'over-6-months': return 'Flexible — early planning stage';
    case 'not-sure': return 'Unknown — worth clarifying soon';
    default: return '';
  }
}

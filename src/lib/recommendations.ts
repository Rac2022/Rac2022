import {
  SnapshotInput,
  SnapshotResult,
  Recommendation,
  RecommendationPath,
  ValueCard,
  ComparisonRow,
  NextStep,
  ValueBand,
} from '@/types';
import { stateConfigs } from '@/data/states';
import {
  scoreAdminBurden,
  scoreFragmentationRisk,
  generateBlindSpots,
  getUrgencyLabel,
} from './scoring';

// ===== Recommendation Path Selection =====
// The logic picks the best-fit path based on weighted signals from the input.
// To adjust recommendations, modify the scoring weights or thresholds below.

function selectPath(input: SnapshotInput): RecommendationPath {
  const { currentSetup, priorities, liveSupport } = input;

  // If already centralized and confident, suggest maintaining with tighter oversight
  if (
    currentSetup.ceApproach === 'centralized' &&
    (currentSetup.confidenceLevel === 'very-confident' || currentSetup.confidenceLevel === 'mostly-confident')
  ) {
    return 'maintain-tighten';
  }

  // Specialty-forward if 3+ specialties selected
  if (priorities.specialties.length >= 3) {
    return 'specialty-blended';
  }

  // Private in-person path
  if (
    priorities.formats.includes('private-in-person') &&
    liveSupport.teamEventsValuable === 'yes'
  ) {
    return 'subscription-private-inperson';
  }

  // Private webinar path
  if (
    priorities.formats.includes('private-webinars') &&
    liveSupport.teamEventsValuable !== 'no'
  ) {
    return 'subscription-private-webinar';
  }

  // Live webinar path
  if (
    liveSupport.needsLiveHours === 'yes' ||
    priorities.formats.includes('live-webinars') ||
    priorities.goals.includes('live-education')
  ) {
    return 'subscription-live-webinar';
  }

  // Default: centralized subscription
  return 'centralized-subscription';
}

// ===== Recommendation Content =====
// Edit titles, rationales, and bullets here to update messaging.

const recommendationContent: Record<RecommendationPath, Omit<Recommendation, 'path'>> = {
  'centralized-subscription': {
    title: 'Centralized Subscription-First Approach',
    rationale:
      'Based on your team profile, a centralized on-demand subscription could provide a strong foundation for CE compliance and planning. This approach may simplify vendor management, give directors better visibility, and create a more consistent learning experience across clinicians.',
    bullets: [
      'Consolidates CE access under one platform for easier oversight',
      'May reduce per-clinician cost compared to fragmented individual purchases',
      'Supports a broad range of topics and professions in one place',
    ],
    whyFit:
      'Your team appears well-suited for a consolidated model that reduces the number of moving parts while still offering flexibility in what each clinician studies.',
  },
  'subscription-live-webinar': {
    title: 'Subscription + Live Webinar Support',
    rationale:
      'Your inputs suggest a need for both on-demand flexibility and live education hours. Combining a subscription platform with live webinar access could help your team meet format-specific requirements while keeping planning centralized.',
    bullets: [
      'On-demand content covers core CE needs across professions',
      'Live webinars may help fulfill state or preference-based live hour requirements',
      'Scheduling webinar attendance can be coordinated at the team level',
    ],
    whyFit:
      'Teams that need live hours alongside flexible on-demand access often benefit from a blended model that covers both without requiring multiple vendor relationships.',
  },
  'subscription-private-webinar': {
    title: 'Subscription + Private Webinar Support',
    rationale:
      'Your team has expressed interest in private webinar-style events. Pairing a centralized subscription with private webinars could let you deliver tailored team learning while maintaining broad CE coverage.',
    bullets: [
      'Private webinars allow topic-specific sessions aligned with team goals',
      'Subscription access fills remaining CE needs flexibly',
      'Private events can be scheduled around your team\u2019s availability',
    ],
    whyFit:
      'If team cohesion and shared learning moments matter, private webinars provide a way to align education with clinical priorities without disrupting daily schedules.',
  },
  'subscription-private-inperson': {
    title: 'Subscription + Private In-Person Event Strategy',
    rationale:
      'Your responses suggest that private in-person events could be valuable for your team. Combined with on-demand subscription access, this approach can create impactful, hands-on learning opportunities while keeping day-to-day CE needs covered.',
    bullets: [
      'In-person events can deepen skill application in specialty areas',
      'On-demand access ensures CE progress continues between events',
      'Private events can be tailored to your team\u2019s clinical focus areas',
    ],
    whyFit:
      'Teams that value hands-on education and team-building often find that a combination of in-person events and on-demand access creates the strongest engagement and learning outcomes.',
  },
  'specialty-blended': {
    title: 'Specialty-Forward Blended Strategy',
    rationale:
      'Your team has multiple specialty interests that may require targeted content. A blended approach combining subscription access with specialty-focused resources could help ensure clinicians get relevant, role-specific education.',
    bullets: [
      'Specialty-focused content can better match clinical development goals',
      'Blended formats (on-demand, live, and events) support different learning styles',
      'A curated specialty pathway may improve engagement over generic CE catalogs',
    ],
    whyFit:
      'When specialty depth matters, a one-size-fits-all library may fall short. A blended strategy lets you balance breadth with targeted depth.',
  },
  'maintain-tighten': {
    title: 'Maintain Current Model — Tighten Visibility and Planning',
    rationale:
      'Your current setup appears relatively centralized and your confidence level is reasonable. Rather than a full overhaul, tightening visibility, improving reporting, and filling any remaining content gaps may be the most practical next step.',
    bullets: [
      'Review reporting to ensure progress is visible at the director level',
      'Identify any format or specialty gaps not covered by the current solution',
      'Consider adding live or event-based education if not yet part of the mix',
    ],
    whyFit:
      'Teams with a working system often benefit more from incremental improvements than from switching platforms.',
  },
};

// ===== Value Cards =====
// Generate 3 directional value cards based on input signals.

function generateValueCards(input: SnapshotInput): ValueCard[] {
  const { currentSetup, priorities, liveSupport } = input;

  // Cost efficiency band
  let costBand: ValueBand = 'Moderate';
  if (currentSetup.ceApproach === 'individual' || currentSetup.ceApproach === 'mixed-vendors') {
    costBand = input.teamProfile.teamSize >= 10 ? 'High Potential' : 'Strong';
  } else if (currentSetup.ceApproach === 'centralized') {
    costBand = 'Limited';
  }

  // Admin simplification band
  let adminBand: ValueBand = 'Moderate';
  if (
    currentSetup.trackingMethod === 'manual-spreadsheets' &&
    (currentSetup.ceApproach === 'individual' || currentSetup.ceApproach === 'mixed-vendors')
  ) {
    adminBand = 'High Potential';
  } else if (currentSetup.trackingMethod === 'centralized-dashboard') {
    adminBand = 'Limited';
  } else {
    adminBand = priorities.goals.includes('reduce-admin') ? 'Strong' : 'Moderate';
  }

  // Planning confidence band
  let planBand: ValueBand = 'Moderate';
  if (
    liveSupport.centralizedVisibility === 'yes' &&
    currentSetup.trackingMethod !== 'centralized-dashboard'
  ) {
    planBand = 'Strong';
  }
  if (currentSetup.confidenceLevel === 'concerned') {
    planBand = 'High Potential';
  }

  return [
    {
      label: 'Cost Efficiency',
      band: costBand,
      note:
        costBand === 'High Potential'
          ? 'Group-based access may meaningfully reduce per-clinician CE costs compared to individual purchases.'
          : costBand === 'Strong'
          ? 'Consolidating CE access could create moderate cost savings over fragmented purchasing.'
          : costBand === 'Limited'
          ? 'Current centralized model may already capture most cost efficiencies.'
          : 'There may be some cost improvement potential through consolidation.',
    },
    {
      label: 'Time / Admin Simplification',
      band: adminBand,
      note:
        adminBand === 'High Potential'
          ? 'Moving from manual tracking and fragmented vendors could significantly reduce administrative effort.'
          : adminBand === 'Strong'
          ? 'Centralizing oversight may noticeably reduce the time spent on CE coordination.'
          : adminBand === 'Limited'
          ? 'Current dashboard and tracking setup likely keeps admin effort manageable.'
          : 'Some admin simplification is possible through better tooling and visibility.',
    },
    {
      label: 'Planning Confidence',
      band: planBand,
      note:
        planBand === 'High Potential'
          ? 'Better visibility and centralized tracking could substantially improve confidence in team readiness.'
          : planBand === 'Strong'
          ? 'A centralized view of CE progress may help close the gap between desired and actual visibility.'
          : 'Moderate improvements in planning confidence are possible with tighter oversight tools.',
    },
  ];
}

// ===== Comparison Table =====

function generateComparison(input: SnapshotInput): ComparisonRow[] {
  const { currentSetup } = input;
  const isFragmented = currentSetup.ceApproach !== 'centralized';

  return [
    {
      dimension: 'Budgeting Visibility',
      current: isFragmented ? 'Spread across individual purchases' : 'Centralized but may lack granularity',
      centralized: 'Predictable group-level budgeting',
    },
    {
      dimension: 'Team-Wide Planning',
      current: isFragmented ? 'Each clinician plans independently' : 'Partially coordinated',
      centralized: 'Director-level oversight of team progress',
    },
    {
      dimension: 'Live Support Flexibility',
      current: 'Depends on individual scheduling',
      centralized: 'Coordinated webinars and private events',
    },
    {
      dimension: 'Specialty Content Alignment',
      current: 'Varies by individual vendor choice',
      centralized: 'Curated pathways aligned with team focus areas',
    },
    {
      dimension: 'Director Visibility',
      current: currentSetup.trackingMethod === 'centralized-dashboard'
        ? 'Dashboard in place'
        : 'Limited or manual oversight',
      centralized: 'Real-time dashboard with team-wide view',
    },
  ];
}

// ===== Next Step =====

function generateNextStep(input: SnapshotInput, path: RecommendationPath): NextStep {
  const steps: Record<RecommendationPath, string> = {
    'centralized-subscription': 'Explore a group-access model to see how centralized CE coverage could work for your team.',
    'subscription-live-webinar': 'Review live webinar and event options to map out how live hours could fit into your CE plan.',
    'subscription-private-webinar': 'Consider scheduling a private webinar pilot to see how team-based events could add value.',
    'subscription-private-inperson': 'Map out a private in-person event alongside on-demand access to see how the blend works for your team.',
    'specialty-blended': 'Build a specialty-focused team pathway to ensure targeted content matches clinical development goals.',
    'maintain-tighten': 'Sanity-check current CE tracking and reporting before the next renewal cycle tightens.',
  };

  return { text: steps[path] };
}

// ===== Main Result Generator =====

export function generateResults(input: SnapshotInput): SnapshotResult {
  const path = selectPath(input);
  const rec = recommendationContent[path];

  const stateConfig = stateConfigs[input.teamProfile.state];
  const liveRelevant =
    input.liveSupport.needsLiveHours === 'yes' ||
    (stateConfig?.liveHoursRelevant ?? false);

  return {
    input,
    urgencyLabel: getUrgencyLabel(input.teamProfile.renewalTimeline),
    liveRelevant,
    blindSpots: generateBlindSpots(input),
    adminBurden: scoreAdminBurden(input),
    fragmentationRisk: scoreFragmentationRisk(input),
    recommendation: { path, ...rec },
    valueCards: generateValueCards(input),
    comparison: generateComparison(input),
    nextStep: generateNextStep(input, path),
  };
}

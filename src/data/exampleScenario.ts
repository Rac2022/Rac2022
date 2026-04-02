import { SnapshotInput } from '@/types';

// Pre-built example scenario for one-click demo
export const exampleScenario: SnapshotInput = {
  teamProfile: {
    teamSize: 12,
    professions: ['PT', 'OT'],
    state: 'NC',
    renewalTimeline: '31-to-90',
  },
  currentSetup: {
    ceApproach: 'mixed-vendors',
    trackingMethod: 'manual-spreadsheets',
    confidenceLevel: 'not-fully-sure',
  },
  priorities: {
    goals: ['compliance', 'reduce-admin', 'live-education'],
    formats: ['on-demand', 'live-webinars', 'private-in-person'],
    specialties: ['orthopedics', 'pelvic-health'],
  },
  liveSupport: {
    needsLiveHours: 'yes',
    teamEventsValuable: 'yes',
    centralizedVisibility: 'yes',
  },
};

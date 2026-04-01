import { StateConfig } from '@/types';

// ===== State Configuration =====
// Easy to expand: just add a new entry with the same shape.
// Data here is illustrative / for planning context only — not compliance advice.

export const stateConfigs: Record<string, StateConfig> = {
  NC: {
    label: 'North Carolina',
    abbreviation: 'NC',
    renewalNote: 'NC licenses typically renew on a biennial cycle. Planning ahead may help avoid last-minute scrambles.',
    liveHoursRelevant: true,
    resultNote: 'North Carolina may require a portion of CE hours to be completed through live or interactive formats.',
  },
  MS: {
    label: 'Mississippi',
    abbreviation: 'MS',
    renewalNote: 'MS renewal cycles vary by profession. Checking deadlines early can reduce risk.',
    liveHoursRelevant: false,
    resultNote: 'Mississippi CE requirements are generally flexible on format, but verifying current rules is recommended.',
  },
  GA: {
    label: 'Georgia',
    abbreviation: 'GA',
    renewalNote: 'GA renewal timelines differ for PT, OT, and SLP. Centralizing tracking may simplify oversight.',
    liveHoursRelevant: true,
    resultNote: 'Georgia may have specific requirements around live or directly supervised CE hours for some professions.',
  },
  IN: {
    label: 'Indiana',
    abbreviation: 'IN',
    renewalNote: 'IN licenses renew on set cycles. Proactive planning can help teams stay ahead.',
    liveHoursRelevant: false,
    resultNote: 'Indiana generally allows a range of CE formats, though requirements should be confirmed per profession.',
  },
  FL: {
    label: 'Florida',
    abbreviation: 'FL',
    renewalNote: 'FL has specific CE requirements that vary by discipline. Early planning is often helpful.',
    liveHoursRelevant: true,
    resultNote: 'Florida may require certain live or interactive CE hours and has profession-specific rules worth reviewing.',
  },
};

// Dropdown-ready list sorted alphabetically
export const stateOptions = Object.values(stateConfigs)
  .sort((a, b) => a.label.localeCompare(b.label))
  .map((s) => ({ value: s.abbreviation, label: s.label }));

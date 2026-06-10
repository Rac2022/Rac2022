import { format, subDays } from 'date-fns'
import type { Category, FailureEntry, Stakes, ZeroDay } from './types'

// ~40 days of realistic demo data for development, toggleable from Settings.
// Seed records carry a "seed-" id prefix so they can be removed cleanly.

export const SEED_PREFIX = 'seed-'

interface SeedEntry {
  attempt: string
  failure: string
  lesson: string
  category: Category
  stakes: Stakes
  rejectionFlag: boolean
}

const SEED_ENTRIES: SeedEntry[] = [
  { attempt: 'Asked for a 15% raise', failure: 'Manager said budget is frozen until Q3. Conversation lasted four minutes.', lesson: 'I opened with an apology. Next time, open with the number.', category: 'rejection', stakes: 3, rejectionFlag: true },
  { attempt: 'Cold-emailed a podcast I want to be on', failure: 'No reply after a week.', lesson: 'Subject line was about me, not them.', category: 'rejection', stakes: 2, rejectionFlag: true },
  { attempt: 'Shipped the pricing page redesign', failure: 'Conversion dropped 4% in the first 48 hours.', lesson: 'I tested it on people who already liked the product.', category: 'judgment', stakes: 2, rejectionFlag: false },
  { attempt: 'Tried to wake at 5:30 to write', failure: 'Snoozed until 7:10. Wrote nothing.', lesson: 'The plan depends on a version of me that goes to bed at 10.', category: 'execution', stakes: 1, rejectionFlag: false },
  { attempt: 'Pitched the freelance client on a retainer', failure: 'They want to stay project-based. Polite, firm no.', lesson: 'I pitched stability; they care about flexibility.', category: 'rejection', stakes: 2, rejectionFlag: true },
  { attempt: 'Meant to ask a question at the meetup Q&A', failure: 'Hand stayed down. Question stayed in my head.', lesson: 'Nobody remembers a mediocre question. Everybody forgets silence.', category: 'courage', stakes: 1, rejectionFlag: false },
  { attempt: 'Refactored the auth module in one sitting', failure: 'Broke session handling. Rolled back at midnight.', lesson: 'One sitting was the mistake, not the refactor.', category: 'execution', stakes: 2, rejectionFlag: false },
  { attempt: 'Applied to speak at the regional conference', failure: 'Rejected. Form letter.', lesson: '', category: 'rejection', stakes: 2, rejectionFlag: true },
  { attempt: 'Estimated the migration at two days', failure: 'Day four and counting.', lesson: 'I estimated the happy path again.', category: 'judgment', stakes: 2, rejectionFlag: false },
  { attempt: 'Tried negotiating the software renewal', failure: 'Got 5% off. Asked for 30%.', lesson: 'Anchored too late — they had already sent the invoice.', category: 'judgment', stakes: 1, rejectionFlag: true },
  { attempt: 'First session of couch-to-5k', failure: 'Walked half of it. Knee complained.', lesson: 'Week one is supposed to be humbling.', category: 'execution', stakes: 1, rejectionFlag: false },
  { attempt: 'Asked the senior engineer to mentor me', failure: 'She said her plate is full this quarter.', lesson: 'A no with a timeline is a later, not a never.', category: 'rejection', stakes: 2, rejectionFlag: true },
  { attempt: 'Wrote the difficult feedback for a teammate', failure: 'Softened it so much the point disappeared. He left the meeting cheerful.', lesson: 'Kindness that hides the message is not kindness.', category: 'courage', stakes: 2, rejectionFlag: false },
  { attempt: 'Launched the newsletter', failure: 'Eleven subscribers. Three are family.', lesson: 'Distribution was an afterthought. It is the thought.', category: 'judgment', stakes: 2, rejectionFlag: false },
  { attempt: 'Tried to fix the flaky test suite', failure: 'Made it flakier. Two new intermittent failures.', lesson: '', category: 'execution', stakes: 1, rejectionFlag: false },
  { attempt: 'Asked about the abandoned storefront lease', failure: 'Landlord wants triple what the business could carry.', lesson: 'Now I know the number. The fantasy had no number.', category: 'rejection', stakes: 3, rejectionFlag: true },
  { attempt: 'Submitted the short story to a magazine', failure: 'Declined in six days. "Not a fit at this time."', lesson: 'Six days means someone read it. That is new.', category: 'rejection', stakes: 2, rejectionFlag: true },
  { attempt: 'Live demo for the prospect', failure: 'Demo environment was down. Improvised with screenshots.', lesson: 'Check the environment an hour before, not five minutes.', category: 'execution', stakes: 3, rejectionFlag: false },
  { attempt: 'Tried to leave work at 5 sharp all week', failure: 'Managed it twice out of five.', lesson: 'The calendar fills itself unless I fill it first.', category: 'execution', stakes: 1, rejectionFlag: false },
  { attempt: 'Proposed dropping the legacy feature', failure: 'Got overruled — two large accounts still depend on it.', lesson: 'Should have pulled usage data before the meeting, not opinions.', category: 'judgment', stakes: 2, rejectionFlag: false },
  { attempt: 'Asked a stranger at the gym for a spot and advice', failure: 'Advice was to lower the weight. He was right.', lesson: 'Ego load-management is also load-management.', category: 'courage', stakes: 1, rejectionFlag: false },
  { attempt: 'Pitched a guest post to the big industry blog', failure: 'Editor passed — angle too generic.', lesson: '"Passed on the angle" is feedback, not rejection of me.', category: 'rejection', stakes: 2, rejectionFlag: true },
  { attempt: 'Tried the harder bouldering route', failure: 'Fell at the third hold, four times.', lesson: 'The third hold needs a hip turn I do not have yet.', category: 'execution', stakes: 1, rejectionFlag: false },
  { attempt: 'Raised the rate for new clients by 40%', failure: 'First prospect at the new rate went quiet.', lesson: 'One silence is not a verdict. Need five data points.', category: 'courage', stakes: 3, rejectionFlag: true },
  { attempt: 'Volunteered to run the postmortem', failure: 'Lost the room in the timeline review. Meeting ran 40 minutes over.', lesson: 'A postmortem needs a chair, not a narrator.', category: 'execution', stakes: 2, rejectionFlag: false },
  { attempt: 'Asked my dad about the family finances', failure: 'He changed the subject twice. I let him.', lesson: 'Two deflections is when the conversation actually starts.', category: 'courage', stakes: 3, rejectionFlag: false },
  { attempt: 'Entered the chili cook-off', failure: 'Placed ninth of eleven.', lesson: 'The winners all browned the meat properly. Fundamentals.', category: 'other', stakes: 1, rejectionFlag: false },
  { attempt: 'Tried to read the dense systems paper in one evening', failure: 'Got to page six of thirty. Re-read page four three times.', lesson: 'Papers like this are a week of mornings, not a night.', category: 'judgment', stakes: 1, rejectionFlag: false },
]

const ZERO_POSITIONS = new Set([3, 9, 17, 24, 31])
const GAP_POSITIONS = new Set([6, 13, 14, 27, 36])

export function buildSeedData(): { entries: FailureEntry[]; zeroDays: ZeroDay[] } {
  const entries: FailureEntry[] = []
  const zeroDays: ZeroDay[] = []
  let entryIdx = 0

  // Walk back 41 days, ending yesterday so today stays unlogged for the demo.
  for (let daysAgo = 41; daysAgo >= 1; daysAgo--) {
    const position = 41 - daysAgo
    const date = format(subDays(new Date(), daysAgo), 'yyyy-MM-dd')
    if (GAP_POSITIONS.has(position)) continue
    if (ZERO_POSITIONS.has(position)) {
      zeroDays.push({ id: `${SEED_PREFIX}zero-${position}`, date, acknowledged: true })
      continue
    }
    const seed = SEED_ENTRIES[entryIdx % SEED_ENTRIES.length]
    entryIdx++
    entries.push({ id: `${SEED_PREFIX}entry-${position}`, date, ...seed })
  }

  return { entries, zeroDays }
}

export function stripSeedData<T extends { id: string }>(records: T[]): T[] {
  return records.filter((r) => !r.id.startsWith(SEED_PREFIX))
}

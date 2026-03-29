export interface Post {
  slug: string
  title: string
  description: string
  date: string
  readingTime: string
  category: string
  featured: boolean
  body: string
}

export const posts: Post[] = [
  {
    slug: 'intelligence-is-not-wisdom',
    title: 'Intelligence Is Not Wisdom',
    description:
      'Processing is not understanding. The gap between intelligence and wisdom is where every important decision lives.',
    date: '2026-03-25',
    readingTime: '5 min read',
    category: 'AI & Judgment',
    featured: true,
    body: `We are surrounded by intelligence now. It writes our emails, predicts our behavior, summarizes our reading. Intelligence, in the computational sense, is no longer scarce.

And yet most serious failures in business and life have nothing to do with a lack of intelligence. They come from a lack of judgment.

Intelligence tells you what the data says. Judgment asks whether the data measures the right thing. Intelligence optimizes a funnel. Judgment asks whether the funnel points somewhere worth going.

## Patterns vs. Meaning

Language models are pattern-matching engines of extraordinary power. They generate better marketing copy than most professionals, summarize contracts in seconds, produce code faster than many engineers.

They cannot tell you whether a decision is right. They cannot weigh trade-offs that require lived experience, moral reasoning, or knowledge of who is in the room and what they care about.

This is not a limitation the next model release will fix. It is a structural feature of how intelligence differs from wisdom.

## The Operator's Question

If you are building systems or running teams, the question is no longer whether to use AI. It is: what should AI handle, and what must remain human?

My rule: machines handle process, humans handle judgment. Automate the repeatable. Protect the irreplaceable.

Get this wrong and you build something fast but fragile. Get it right and you build something that compounds.

## Where the Leverage Is

The next decade belongs to people who can hold two things at once: AI is genuinely powerful, and human judgment remains irreplaceable. Not as a comforting story. As an operating principle.

Intelligence is abundant. Wisdom never was. That is where the leverage lives.`,
  },
  {
    slug: 'systems-shape-behavior',
    title: 'You Fall to the Level of Your Systems',
    description:
      'Organizations say they value innovation, then build systems that reward conformity. The system always wins.',
    date: '2026-03-18',
    readingTime: '4 min read',
    category: 'Systems Thinking',
    featured: true,
    body: `Every organization claims to value innovation, creativity, bold thinking. Then they build incentive structures that reward conformity, punish risk, and optimize for quarterly numbers.

The problem is rarely the people. It is almost always the system.

## Why Intentions Lose

Intentions depend on willpower, mood, and memory. Systems run regardless. They shape behavior at scale, across teams, across years.

Want to understand why a team behaves the way it does? Skip the values statement. Look at what gets measured. Look at what gets rewarded. That is the actual system.

## Redesign, Don't Motivate

The most effective operators I have worked with do not try to change people. They redesign the systems people operate inside.

A sales team rewarded only for closed deals will never invest in long-term relationships. A product team measured only by shipping velocity will never invest in quality. Every time, the system determines the behavior.

## Why Most AI Deployments Fail

This is the overlooked reason AI implementation fails. Organizations drop powerful tools into broken systems and wonder why nothing changes.

AI does not fix bad systems. It accelerates them.

Before you automate, ask: is the underlying process producing the outcomes we actually want? If not, the first job is redesign, not deployment.

You do not rise to the level of your goals. You fall to the level of your systems.`,
  },
  {
    slug: 'preparing-for-ai-shaped-future',
    title: 'Preparation Is a Practice, Not a Plan',
    description:
      'Nobody has a roadmap for the AI future. The useful preparation is not mastering today\'s tools but building the capacity to think clearly under uncertainty.',
    date: '2026-03-10',
    readingTime: '5 min read',
    category: 'Future Thinking',
    featured: false,
    body: `Everyone wants a roadmap. Learn this framework. Master this tool. Get certified on this platform.

Nobody has one. Not the researchers building the models. Not the executives deploying them. The landscape shifts too fast for fixed plans.

## Shallow vs. Deep Preparation

Most "AI readiness" advice is tool-focused. Learn prompt engineering. Learn ChatGPT. This is not wrong, but it is shallow. The tool you master today may be irrelevant in eighteen months.

The skills that matter across every version of the AI future are older than AI itself:

**Clear thinking.** Breaking complex problems into components, identifying assumptions, reasoning through consequences. No model does this for you, because no model knows what matters to you.

**Judgment under uncertainty.** Knowing when you have enough information to act and when to wait. This becomes more valuable as the information environment gets noisier.

**Adaptability.** The real kind: willingness to abandon what you know when it stops working, without losing direction.

**Translation.** Making technical possibility legible to people who are not technical. This matters more as the tools grow more powerful.

## What I Do Instead of Predicting

I build systems and habits that work across multiple futures. I write to think clearly. I build to learn. I stay close to the frontier not to be early but to understand what is actually happening.

The best preparation for an uncertain future is not a plan. It is a practice.`,
  },
  {
    slug: 'limits-of-optimization',
    title: 'When Optimizing Makes Things Worse',
    description:
      'Optimization assumes you are measuring the right thing. You usually are not. The most important things in business resist measurement entirely.',
    date: '2026-03-01',
    readingTime: '4 min read',
    category: 'Systems Thinking',
    featured: false,
    body: `Optimization works. Every dashboard, KPI, and quarterly review exists to make numbers go up, and they do. Measurable, reportable, impressive results.

The trap: the assumption that what you are measuring is what actually matters.

## Goodhart's Law

"When a measure becomes a target, it ceases to be a good measure."

Optimize for email open rates and you get clickbait. Optimize for code commits and you get smaller, less meaningful changes. Optimize for satisfaction scores and you get teams gaming the survey instead of improving the experience.

The metric improves. The thing the metric was supposed to represent gets worse.

## The Unmeasurables

Trust takes years to build and fits in no dashboard. Creativity requires slack, not efficiency. Deep relationships do not scale.

AI accelerates this problem. It is the ultimate optimization engine: it finds patterns and maximizes metrics faster than any team. But it cannot know whether those metrics point at the right thing.

## A Test

Before you optimize anything, ask: what happens if this metric goes to infinity? If the answer is absurd, you are optimizing the wrong thing.

Do not stop measuring. Hold measurements loosely. Use them as instruments, not as destinations. And protect space for the things that matter enormously but resist quantification.`,
  },
  {
    slug: 'long-term-thinking-short-term-world',
    title: 'The Patience Premium',
    description:
      'Almost everything worth building takes longer than a quarter. The compounding advantage belongs to people who can resist the pull of the immediate.',
    date: '2026-02-20',
    readingTime: '4 min read',
    category: 'Strategy',
    featured: false,
    body: `The default setting of modern work is short-term. Quarterly targets. Weekly sprints. Daily standups. The entire structure pushes attention toward the immediate.

Short-term results are visible, measurable, rewarding. Long-term thinking is invisible, uncertain, and unrewarded until years later.

But almost everything worth building takes longer than a quarter.

## Compounding Requires Holding the Course

Short-term thinking feels productive. Long-term thinking feels slow. The math of compounding does not care how it feels.

Most people and organizations abandon long-term strategies before they have time to work. They switch frameworks, pivot strategies, chase trends. Each individual decision seems reasonable. The cumulative effect is that nothing compounds.

## Speed Without Direction

AI tools bias toward speed. They generate, summarize, and execute faster than ever. Useful. But speed without direction is motion, not progress.

The risk: AI makes us faster at things that do not matter. More emails sent. More content published. More decisions made. Faster is not better if you are headed somewhere wrong.

## The Practice

Long-term thinking is not a strategy document. It is asking, before every decision: will this matter in five years?

It means protecting time to think without producing. Saying no to opportunities that are good but not aligned. Building slowly when the world screams at you to move faster.

The people who build things that last are not the fastest. They are the most deliberate.`,
  },
  {
    slug: 'human-agency-age-of-ai',
    title: 'What to Keep for Yourself',
    description:
      'Every time you delegate a decision to a machine, you get a little less practice making it yourself. The muscle atrophies. Choose carefully.',
    date: '2026-02-10',
    readingTime: '5 min read',
    category: 'AI & Judgment',
    featured: false,
    body: `Every month AI takes on more of what humans used to do. It writes first drafts. Suggests next moves. Filters what we see. Most of this is genuinely helpful.

The quiet cost: every time you delegate a decision to a machine, you get a little less practice making it yourself. The muscle atrophies. Not because the machine forced you, but because you let it.

## The Convenience Trap

AI is convenient. That is its greatest strength and greatest risk.

Let it draft your emails, and you stop thinking about how to communicate. Let it summarize your reading, and you stop developing your own interpretation. Let it make your decisions, and you stop building the judgment to make them well.

No single step is dangerous. In aggregate, it is a transfer of agency from human to machine that most people never consciously chose.

## A Framework for Keeping

Which decisions, when made by me, make me better over time? Those are the ones to protect.

Strategic thinking. Relationship building. Creative work. Ethical reasoning. These are not just tasks. They are practices that develop capacity. Delegate them entirely and you lose the capacity along with the task.

## Design Philosophy

The best AI systems do not do the most for you. They help you do more yourself. They surface information, reduce friction, handle the mechanical work so you can focus on what requires human judgment.

AI as amplifier, not replacement. Tools that make people sharper, not unnecessary.

We are at a unique moment. The tools are powerful enough to do almost anything for us. The question is not what they can do. It is what we choose to keep.

That choice is still ours. How deliberately we make it determines whether it stays that way.`,
  },
]

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getFeaturedPosts(): Post[] {
  return posts.filter((p) => p.featured)
}

export function getRecentPosts(limit = 3): Post[] {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit)
}

export function getRelatedPosts(currentSlug: string, limit = 3): Post[] {
  const current = getPost(currentSlug)
  if (!current) return []
  return posts
    .filter((p) => p.slug !== currentSlug)
    .sort((a, b) => {
      const aMatch = a.category === current.category ? 1 : 0
      const bMatch = b.category === current.category ? 1 : 0
      return bMatch - aMatch
    })
    .slice(0, limit)
}

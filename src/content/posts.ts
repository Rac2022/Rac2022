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
      'AI can process more information in a second than any human can in a lifetime. But processing is not understanding. The gap between intelligence and wisdom is where the most important decisions live.',
    date: '2026-03-25',
    readingTime: '6 min read',
    category: 'AI & Judgment',
    featured: true,
    body: `We are surrounded by intelligence. It sits in our pockets. It writes our emails. It predicts what we want before we know we want it.

And yet, most of the serious problems in business, in life, in how we build the future have nothing to do with a lack of intelligence. They come from a lack of judgment.

Intelligence can tell you what the data says. Wisdom asks whether the data is measuring the right thing. Intelligence can optimize a funnel. Wisdom asks whether the funnel is pointed at something worth optimizing.

## The Machine Sees Patterns. You See Meaning.

Large language models are extraordinary pattern-matching engines. They can write better copy than most marketers, summarize legal documents in seconds, and generate code faster than many engineers. But they cannot tell you whether a decision is right. They cannot weigh trade-offs that require lived experience, moral reasoning, or an understanding of what matters to the people in the room.

This is not a limitation that will be solved with the next model release. It is a fundamental feature of how intelligence differs from wisdom.

## What This Means for Builders

If you are building systems, teams, or businesses, the question is not whether to use AI. That question is settled. The real question is: what should AI handle, and what should remain human?

My working rule: let machines handle process, and protect the space for human judgment. Automate the repeatable. Preserve the irreplaceable.

The leaders who get this balance right will build companies that are not just efficient but resilient. Not just fast but thoughtful. Not just profitable but worth building.

## The Path Forward

The next decade belongs to people who can hold two ideas at once: that AI is genuinely powerful and that human judgment remains irreplaceable. Not as a comforting story, but as an operating principle.

Intelligence is abundant now. Wisdom never was. That gap is where the leverage lives.`,
  },
  {
    slug: 'systems-shape-behavior',
    title: 'Systems Shape Behavior More Than Intentions',
    description:
      'We like to think our choices come from within. But the systems we operate inside quietly shape what we do, what we notice, and what we ignore. Designing better systems matters more than trying harder.',
    date: '2026-03-18',
    readingTime: '5 min read',
    category: 'Systems Thinking',
    featured: true,
    body: `Every organization says they value innovation. Creativity. Bold thinking. Then they build systems that reward conformity, punish risk, and optimize for short-term metrics.

The problem is never the people. The problem is almost always the system.

## Why Intentions Fail

Intentions are fragile. They depend on willpower, mood, and memory. Systems are durable. They run whether you feel motivated or not. They shape behavior at scale, across teams, across time.

If you want to understand why a team behaves the way it does, do not ask about their values. Look at their incentives. Look at what gets measured. Look at what gets rewarded. That is the real system.

## Designing for the Outcome You Want

The most effective leaders I have worked with do not spend their energy trying to change people. They spend it redesigning the systems those people operate inside.

A sales team that is rewarded only for closed deals will never prioritize long-term relationships. A product team measured only by shipping speed will never invest in quality. The system determines the behavior. Every time.

## The AI Connection

This is why AI implementation fails in most organizations. They drop a powerful tool into a broken system and wonder why nothing changes. AI does not fix bad systems. It accelerates them.

Before you automate anything, ask: is the underlying system producing the outcomes we actually want? If not, the first job is redesign, not deployment.

## The Takeaway

You do not rise to the level of your goals. You fall to the level of your systems. This is true for individuals, teams, and entire industries. Design accordingly.`,
  },
  {
    slug: 'preparing-for-ai-shaped-future',
    title: 'How to Prepare for a Future You Cannot Predict',
    description:
      'The AI future will not arrive the way anyone expects. The most useful preparation is not learning specific tools but developing the capacity to learn, adapt, and think clearly under uncertainty.',
    date: '2026-03-10',
    readingTime: '7 min read',
    category: 'Future Thinking',
    featured: false,
    body: `Everyone wants a roadmap for the AI future. Learn this framework. Master this tool. Get certified in this platform. The demand for certainty is enormous.

But here is the uncomfortable truth: nobody has a roadmap. Not the researchers building the models. Not the executives deploying them. Not the consultants selling transformation strategies. The landscape is shifting too fast for fixed plans.

## The Wrong Kind of Preparation

Most "AI readiness" advice focuses on tools. Learn prompt engineering. Learn to use ChatGPT. Get comfortable with Copilot. This advice is not wrong, but it is shallow. Tools change. The tool you master today may be irrelevant in eighteen months.

## The Right Kind of Preparation

The skills that will matter across every version of the AI future are older than AI itself:

**Clear thinking.** The ability to break complex problems into components, identify assumptions, and reason through consequences. No model can do this for you, because the model does not know what matters to you.

**Judgment under uncertainty.** Knowing when you have enough information to act and when you need to wait. Knowing which risks are worth taking. This is a human skill, and it becomes more valuable as the information environment gets noisier.

**Adaptability.** Not the buzzword version. The real kind: willingness to abandon what you know when it stops working, without losing your sense of direction.

**Communication.** The ability to translate technical possibility into business reality, and to explain complex ideas to people who are not technical. This skill becomes more important as the tools become more powerful.

## My Approach

I do not try to predict the future. I try to build systems and habits that work across multiple futures. I write to think clearly. I build to learn. I stay close to the frontier not because I want to be early but because I want to understand what is actually happening.

The best preparation for an uncertain future is not a plan. It is a practice.`,
  },
  {
    slug: 'limits-of-optimization',
    title: 'The Trap of Optimizing Everything',
    description:
      'Optimization is a powerful tool with a hidden cost. When we optimize for metrics, we often lose the things that matter most but resist measurement: trust, creativity, meaning.',
    date: '2026-03-01',
    readingTime: '5 min read',
    category: 'Systems Thinking',
    featured: false,
    body: `We live in an optimization culture. Every dashboard, every KPI, every quarterly review is an exercise in making numbers go up. And it works. Optimization produces results. Measurable, reportable, impressive results.

But there is a trap hiding inside every optimization: the assumption that what you are measuring is what actually matters.

## Goodhart's Law in Practice

"When a measure becomes a target, it ceases to be a good measure." This is Goodhart's Law, and it explains most of what goes wrong in modern organizations.

Optimize for email open rates, and you get clickbait subject lines. Optimize for code commits, and you get smaller, less meaningful changes. Optimize for customer satisfaction scores, and you get teams that game the survey rather than improve the experience.

The metric improves. The thing the metric was supposed to represent gets worse.

## What Cannot Be Optimized

The most important things in business and life resist measurement. Trust takes years to build and cannot be captured in a dashboard. Creativity requires slack, not efficiency. Deep relationships are not scalable.

AI makes this problem worse, not better. AI is the ultimate optimization engine. It can find patterns and maximize metrics faster than any human team. But it has no way to know whether those metrics are pointing at the right thing.

## A Better Question

Before you optimize, ask: what happens if this metric goes to infinity? If the answer is absurd or harmful, you are optimizing the wrong thing.

The goal is not to stop measuring. It is to hold your measurements loosely. Use them as guides, not gods. And protect the space for things that cannot be measured but matter enormously.`,
  },
  {
    slug: 'long-term-thinking-short-term-world',
    title: 'Long-Term Thinking in a Short-Term World',
    description:
      'Quarterly earnings. Daily metrics. Hourly notifications. Everything pushes us toward short-term thinking. The people who build things that last are the ones who resist that pull.',
    date: '2026-02-20',
    readingTime: '4 min read',
    category: 'Strategy',
    featured: false,
    body: `The default setting of modern life is short-term. Quarterly targets. Weekly sprints. Daily standups. The entire structure of how we work pushes attention toward the immediate.

This is understandable. Short-term results are visible, measurable, and rewarding. Long-term thinking is invisible, uncertain, and often unrewarded until years later.

But almost everything worth building takes longer than a quarter.

## The Compounding Problem

Short-term thinking feels productive. Long-term thinking feels slow. But the math of compounding always wins. A 1% improvement per day is 37x over a year. But only if you hold the course.

Most people and most organizations abandon long-term strategies before they have time to compound. They switch frameworks, pivot strategies, chase new trends. Each individual decision seems reasonable. The cumulative effect is that nothing has time to work.

## Where AI Makes This Harder

AI tools are biased toward speed. They can generate, summarize, and execute faster than ever. This is useful. But speed without direction is just motion.

The risk is that AI makes us faster at doing things that do not matter. More emails sent. More content published. More decisions made. Faster is not better if you are headed in the wrong direction.

## A Practice, Not a Strategy

Long-term thinking is not a strategy document. It is a daily practice. It means asking, before every decision: will this matter in five years? And being honest about the answer.

It means protecting time to think without producing anything. It means saying no to opportunities that are good but not aligned. It means building slowly and deliberately, even when the world is screaming at you to move faster.

The people who build things that last are not the fastest. They are the most patient.`,
  },
  {
    slug: 'human-agency-age-of-ai',
    title: 'Protecting Human Agency in the Age of AI',
    description:
      'As AI systems make more decisions on our behalf, the most important question is not what AI can do but what we choose to keep for ourselves.',
    date: '2026-02-10',
    readingTime: '6 min read',
    category: 'AI & Judgment',
    featured: false,
    body: `Every month, AI takes on more of what humans used to do. It writes our first drafts. It suggests our next moves. It filters what we see and shapes what we think about. Most of this is genuinely helpful.

But there is a quiet cost. Every time we delegate a decision to a machine, we get a little less practice at making that decision ourselves. Over time, the muscle atrophies. Not because the machine forced us, but because we let it.

## The Convenience Trap

AI is convenient. That is its greatest strength and its greatest risk. Convenience is the path of least resistance, and humans are wired to follow it.

Let AI draft your emails, and you stop thinking about how to communicate. Let AI summarize your reading, and you stop developing your own interpretation. Let AI make your decisions, and you stop building the judgment to make them well.

None of these individual steps seem dangerous. In aggregate, they represent a transfer of agency from human to machine that most people never consciously chose.

## What to Keep

I think about this in terms of a simple framework: what decisions, when made by me, make me better over time? Those are the ones to protect.

Strategic thinking. Relationship building. Creative work. Ethical reasoning. These are not just tasks. They are practices that develop capacity. The more you do them, the better you get. Delegate them entirely, and you lose the capacity along with the task.

## Building AI That Preserves Agency

The best AI systems are not the ones that do the most for you. They are the ones that help you do more yourself. They surface information, reduce friction, and handle the mechanical parts of work so you can focus on the parts that require human judgment.

This is the design philosophy I try to follow: AI as amplifier, not replacement. Tools that make people sharper, not tools that make people unnecessary.

## The Choice

We are at a unique moment. The tools are powerful enough to do almost anything for us. The question is not what they can do. The question is what we choose to keep for ourselves.

That choice, right now, is still ours. Whether it stays that way depends on how deliberately we make it.`,
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

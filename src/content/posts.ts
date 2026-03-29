import type { Lang } from '@/i18n'

export interface Post {
  slug: string
  title: string
  title_es: string
  description: string
  description_es: string
  date: string
  readingTime: string
  readingTime_es: string
  category: string
  category_es: string
  featured: boolean
  body: string
  body_es: string
}

export function localized(post: Post, lang: Lang) {
  return {
    ...post,
    title: lang === 'es' ? post.title_es : post.title,
    description: lang === 'es' ? post.description_es : post.description,
    readingTime: lang === 'es' ? post.readingTime_es : post.readingTime,
    category: lang === 'es' ? post.category_es : post.category,
    body: lang === 'es' ? post.body_es : post.body,
  }
}

export const posts: Post[] = [
  {
    slug: 'intelligence-is-not-wisdom',
    title: 'Intelligence Is Not Wisdom',
    title_es: 'La inteligencia no es sabidur\u00eda',
    description:
      'Processing is not understanding. The gap between intelligence and wisdom is where every important decision lives.',
    description_es: 'Procesar no es entender. La brecha entre inteligencia y sabidur\u00eda es donde vive cada decisi\u00f3n importante.',
    date: '2026-03-25',
    readingTime: '5 min read',
    readingTime_es: '5 min de lectura',
    category: 'AI & Judgment',
    category_es: 'IA y criterio',
    featured: true,
    body_es: `Estamos rodeados de inteligencia. Escribe nuestros correos, predice nuestro comportamiento, resume nuestras lecturas. La inteligencia, en el sentido computacional, ya no es escasa.

Y sin embargo, la mayor\u00eda de los fracasos serios en los negocios y en la vida no tienen nada que ver con falta de inteligencia. Vienen de una falta de criterio.

La inteligencia te dice lo que dicen los datos. El criterio pregunta si los datos miden lo correcto. La inteligencia optimiza un embudo. El criterio pregunta si el embudo apunta a alg\u00fan lugar que valga la pena.

## Patrones vs. significado

Los modelos de lenguaje son motores de reconocimiento de patrones de un poder extraordinario. Generan mejor copy que la mayor\u00eda de los profesionales, resumen contratos en segundos, producen c\u00f3digo m\u00e1s r\u00e1pido que muchos ingenieros.

No pueden decirte si una decisi\u00f3n es correcta. No pueden sopesar trade-offs que requieren experiencia vivida, razonamiento moral o conocimiento de qui\u00e9n est\u00e1 en la sala y qu\u00e9 les importa.

Esto no es una limitaci\u00f3n que el pr\u00f3ximo modelo va a resolver. Es una caracter\u00edstica estructural de c\u00f3mo la inteligencia difiere de la sabidur\u00eda.

## La pregunta del operador

Si est\u00e1s construyendo sistemas o liderando equipos, la pregunta ya no es si usar IA. Es: \u00bfqu\u00e9 debe manejar la IA y qu\u00e9 debe seguir siendo humano?

Mi regla: las m\u00e1quinas manejan procesos, los humanos manejan el criterio. Automatiza lo repetible. Protege lo irremplazable.

Si te equivocas, construyes algo r\u00e1pido pero fr\u00e1gil. Si aciertas, construyes algo que se acumula.

## D\u00f3nde est\u00e1 la palanca

La pr\u00f3xima d\u00e9cada pertenece a quienes puedan sostener dos ideas a la vez: la IA es genuinamente poderosa, y el criterio humano sigue siendo irremplazable. No como una historia reconfortante. Como un principio operativo.

La inteligencia es abundante. La sabidur\u00eda nunca lo fue. Ah\u00ed es donde vive la palanca.`,
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
    title_es: 'Caes al nivel de tus sistemas',
    description:
      'Organizations say they value innovation, then build systems that reward conformity. The system always wins.',
    description_es: 'Las organizaciones dicen que valoran la innovaci\u00f3n, luego construyen sistemas que premian la conformidad. El sistema siempre gana.',
    date: '2026-03-18',
    readingTime: '4 min read',
    readingTime_es: '4 min de lectura',
    category: 'Systems Thinking',
    category_es: 'Pensamiento sist\u00e9mico',
    featured: true,
    body_es: `Toda organizaci\u00f3n dice que valora la innovaci\u00f3n, la creatividad, el pensamiento audaz. Luego construyen estructuras de incentivos que premian la conformidad, castigan el riesgo y optimizan para n\u00fameros trimestrales.

El problema rara vez es la gente. Casi siempre es el sistema.

## Por qu\u00e9 las intenciones pierden

Las intenciones dependen de la fuerza de voluntad, el \u00e1nimo y la memoria. Los sistemas funcionan sin importar nada. Moldean el comportamiento a escala, entre equipos, a trav\u00e9s de los a\u00f1os.

\u00bfQuieres entender por qu\u00e9 un equipo se comporta como lo hace? Olvida la declaraci\u00f3n de valores. Mira qu\u00e9 se mide. Mira qu\u00e9 se premia. Ese es el sistema real.

## Redise\u00f1a, no motives

Los operadores m\u00e1s efectivos con los que he trabajado no intentan cambiar a las personas. Redise\u00f1an los sistemas dentro de los cuales operan.

Un equipo de ventas premiado solo por cierres nunca invertir\u00e1 en relaciones a largo plazo. Un equipo de producto medido solo por velocidad de entrega nunca invertir\u00e1 en calidad. Siempre, el sistema determina el comportamiento.

## Por qu\u00e9 fracasan la mayor\u00eda de implementaciones de IA

Esta es la raz\u00f3n que se pasa por alto. Las organizaciones colocan herramientas poderosas dentro de sistemas rotos y se preguntan por qu\u00e9 nada cambia.

La IA no arregla sistemas malos. Los acelera.

Antes de automatizar, pregunta: \u00bfel proceso subyacente est\u00e1 produciendo los resultados que realmente queremos? Si no, el primer trabajo es redise\u00f1ar, no implementar.

No te elevas al nivel de tus metas. Caes al nivel de tus sistemas.`,
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
    title_es: 'La preparaci\u00f3n es una pr\u00e1ctica, no un plan',
    description:
      'Nobody has a roadmap for the AI future. The useful preparation is not mastering today\'s tools but building the capacity to think clearly under uncertainty.',
    description_es: 'Nadie tiene un mapa para el futuro de la IA. La preparaci\u00f3n \u00fatil no es dominar las herramientas de hoy sino desarrollar la capacidad de pensar con claridad bajo incertidumbre.',
    date: '2026-03-10',
    readingTime: '5 min read',
    readingTime_es: '5 min de lectura',
    category: 'Future Thinking',
    category_es: 'Pensamiento futuro',
    featured: false,
    body_es: `Todos quieren un mapa. Aprende este framework. Domina esta herramienta. Certif\u00edcate en esta plataforma.

Nadie tiene uno. Ni los investigadores que construyen los modelos. Ni los ejecutivos que los implementan. El paisaje cambia demasiado r\u00e1pido para planes fijos.

## Preparaci\u00f3n superficial vs. profunda

La mayor\u00eda de los consejos de "preparaci\u00f3n para la IA" se enfocan en herramientas. Aprende prompt engineering. Aprende ChatGPT. No est\u00e1 mal, pero es superficial. La herramienta que dominas hoy puede ser irrelevante en dieciocho meses.

Las habilidades que importar\u00e1n en cada versi\u00f3n del futuro de la IA son m\u00e1s viejas que la IA misma:

**Pensamiento claro.** Descomponer problemas complejos en componentes, identificar supuestos, razonar las consecuencias. Ning\u00fan modelo hace esto por ti, porque ning\u00fan modelo sabe qu\u00e9 te importa.

**Criterio bajo incertidumbre.** Saber cu\u00e1ndo tienes suficiente informaci\u00f3n para actuar y cu\u00e1ndo esperar. Esto se vuelve m\u00e1s valioso conforme el entorno informativo se vuelve m\u00e1s ruidoso.

**Adaptabilidad.** La real: disposici\u00f3n a abandonar lo que sabes cuando deja de funcionar, sin perder la direcci\u00f3n.

**Traducci\u00f3n.** Hacer que la posibilidad t\u00e9cnica sea legible para personas no t\u00e9cnicas. Esto importa m\u00e1s conforme las herramientas se vuelven m\u00e1s poderosas.

## Lo que hago en vez de predecir

Construyo sistemas y h\u00e1bitos que funcionan en m\u00faltiples futuros. Escribo para pensar con claridad. Construyo para aprender. Me mantengo cerca de la frontera no para ser temprano sino para entender lo que realmente est\u00e1 pasando.

La mejor preparaci\u00f3n para un futuro incierto no es un plan. Es una pr\u00e1ctica.`,
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
    title_es: 'Cuando optimizar empeora las cosas',
    description:
      'Optimization assumes you are measuring the right thing. You usually are not. The most important things in business resist measurement entirely.',
    description_es: 'La optimizaci\u00f3n asume que est\u00e1s midiendo lo correcto. Generalmente no lo est\u00e1s. Lo m\u00e1s importante en los negocios se resiste por completo a la medici\u00f3n.',
    date: '2026-03-01',
    readingTime: '4 min read',
    readingTime_es: '4 min de lectura',
    category: 'Systems Thinking',
    category_es: 'Pensamiento sist\u00e9mico',
    featured: false,
    body_es: `La optimizaci\u00f3n funciona. Cada dashboard, KPI y revisi\u00f3n trimestral existe para hacer que los n\u00fameros suban, y lo logran. Resultados medibles, reportables, impresionantes.

La trampa: asumir que lo que est\u00e1s midiendo es lo que realmente importa.

## La Ley de Goodhart

"Cuando una medida se convierte en objetivo, deja de ser una buena medida."

Optimiza para tasas de apertura de email y obtienes clickbait. Optimiza para commits de c\u00f3digo y obtienes cambios m\u00e1s peque\u00f1os y menos significativos. Optimiza para puntajes de satisfacci\u00f3n y obtienes equipos manipulando la encuesta en vez de mejorar la experiencia.

La m\u00e9trica mejora. Lo que la m\u00e9trica deb\u00eda representar empeora.

## Lo que no se puede medir

La confianza toma a\u00f1os en construirse y no cabe en ning\u00fan dashboard. La creatividad requiere holgura, no eficiencia. Las relaciones profundas no escalan.

La IA acelera este problema. Es el motor de optimizaci\u00f3n definitivo: encuentra patrones y maximiza m\u00e9tricas m\u00e1s r\u00e1pido que cualquier equipo. Pero no puede saber si esas m\u00e9tricas apuntan a lo correcto.

## Una prueba

Antes de optimizar cualquier cosa, pregunta: \u00bfqu\u00e9 pasa si esta m\u00e9trica llega al infinito? Si la respuesta es absurda, est\u00e1s optimizando lo incorrecto.

No dejes de medir. Sost\u00e9n las mediciones con mano ligera. \u00dasalas como instrumentos, no como destinos. Y protege espacio para las cosas que importan enormemente pero se resisten a la cuantificaci\u00f3n.`,
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
    title_es: 'La prima de la paciencia',
    description:
      'Almost everything worth building takes longer than a quarter. The compounding advantage belongs to people who can resist the pull of the immediate.',
    description_es: 'Casi todo lo que vale la pena construir toma m\u00e1s de un trimestre. La ventaja compuesta pertenece a quienes pueden resistir la atracci\u00f3n de lo inmediato.',
    date: '2026-02-20',
    readingTime: '4 min read',
    readingTime_es: '4 min de lectura',
    category: 'Strategy',
    category_es: 'Estrategia',
    featured: false,
    body_es: `La configuraci\u00f3n por defecto del trabajo moderno es a corto plazo. Metas trimestrales. Sprints semanales. Standups diarios. Toda la estructura empuja la atenci\u00f3n hacia lo inmediato.

Los resultados a corto plazo son visibles, medibles, gratificantes. El pensamiento a largo plazo es invisible, incierto y no se recompensa hasta a\u00f1os despu\u00e9s.

Pero casi todo lo que vale la pena construir toma m\u00e1s de un trimestre.

## El inter\u00e9s compuesto requiere mantener el curso

El pensamiento a corto plazo se siente productivo. El de largo plazo se siente lento. A las matem\u00e1ticas del inter\u00e9s compuesto no les importa c\u00f3mo se siente.

La mayor\u00eda de las personas y organizaciones abandonan las estrategias a largo plazo antes de que tengan tiempo de funcionar. Cambian frameworks, pivotan estrategias, persiguen tendencias. Cada decisi\u00f3n individual parece razonable. El efecto acumulado es que nada se acumula.

## Velocidad sin direcci\u00f3n

Las herramientas de IA favorecen la velocidad. Generan, resumen y ejecutan m\u00e1s r\u00e1pido que nunca. \u00datil. Pero velocidad sin direcci\u00f3n es movimiento, no progreso.

El riesgo: la IA nos hace m\u00e1s r\u00e1pidos en cosas que no importan. M\u00e1s emails enviados. M\u00e1s contenido publicado. M\u00e1s decisiones tomadas. M\u00e1s r\u00e1pido no es mejor si vas en la direcci\u00f3n equivocada.

## La pr\u00e1ctica

El pensamiento a largo plazo no es un documento de estrategia. Es preguntar, antes de cada decisi\u00f3n: \u00bfesto importar\u00e1 en cinco a\u00f1os?

Significa proteger tiempo para pensar sin producir. Decir no a oportunidades que son buenas pero no est\u00e1n alineadas. Construir despacio cuando el mundo te grita que te muevas m\u00e1s r\u00e1pido.

Las personas que construyen cosas que perduran no son las m\u00e1s r\u00e1pidas. Son las m\u00e1s deliberadas.`,
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
    title_es: 'Qu\u00e9 quedarte para ti',
    description:
      'Every time you delegate a decision to a machine, you get a little less practice making it yourself. The muscle atrophies. Choose carefully.',
    description_es: 'Cada vez que delegas una decisi\u00f3n a una m\u00e1quina, practicas un poco menos tomarla t\u00fa. El m\u00fasculo se atrofia. Elige con cuidado.',
    date: '2026-02-10',
    readingTime: '5 min read',
    readingTime_es: '5 min de lectura',
    category: 'AI & Judgment',
    category_es: 'IA y criterio',
    featured: false,
    body_es: `Cada mes la IA asume m\u00e1s de lo que los humanos sol\u00edan hacer. Escribe primeros borradores. Sugiere pr\u00f3ximos pasos. Filtra lo que vemos. La mayor parte es genuinamente \u00fatil.

El costo silencioso: cada vez que delegas una decisi\u00f3n a una m\u00e1quina, practicas un poco menos tomarla t\u00fa mismo. El m\u00fasculo se atrofia. No porque la m\u00e1quina te oblig\u00f3, sino porque t\u00fa lo permitiste.

## La trampa de la conveniencia

La IA es conveniente. Esa es su mayor fortaleza y su mayor riesgo.

Deja que redacte tus correos y dejas de pensar en c\u00f3mo comunicarte. Deja que resuma tus lecturas y dejas de desarrollar tu propia interpretaci\u00f3n. Deja que tome tus decisiones y dejas de construir el criterio para tomarlas bien.

Ning\u00fan paso individual es peligroso. En conjunto, es una transferencia de agencia del humano a la m\u00e1quina que la mayor\u00eda de las personas nunca eligi\u00f3 conscientemente.

## Un marco para decidir qu\u00e9 conservar

\u00bfQu\u00e9 decisiones, cuando las tomo yo, me hacen mejor con el tiempo? Esas son las que hay que proteger.

Pensamiento estrat\u00e9gico. Construcci\u00f3n de relaciones. Trabajo creativo. Razonamiento \u00e9tico. No son solo tareas. Son pr\u00e1cticas que desarrollan capacidad. Del\u00e9galas por completo y pierdes la capacidad junto con la tarea.

## Filosof\u00eda de dise\u00f1o

Los mejores sistemas de IA no son los que hacen m\u00e1s por ti. Son los que te ayudan a hacer m\u00e1s t\u00fa mismo. Surfean informaci\u00f3n, reducen fricci\u00f3n, manejan el trabajo mec\u00e1nico para que t\u00fa puedas enfocarte en lo que requiere criterio humano.

IA como amplificador, no como reemplazo. Herramientas que hacen a la gente m\u00e1s aguda, no innecesaria.

Estamos en un momento \u00fanico. Las herramientas son lo suficientemente poderosas para hacer casi cualquier cosa por nosotros. La pregunta no es qu\u00e9 pueden hacer. Es qu\u00e9 elegimos quedarnos para nosotros.

Esa elecci\u00f3n, ahora mismo, sigue siendo nuestra. Qu\u00e9 tan deliberadamente la tomemos determina si seguir\u00e1 si\u00e9ndolo.`,
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
  {
    slug: 'intelligence-scaling-faster-than-wisdom',
    title: 'Intelligence Is Scaling Faster Than Wisdom',
    title_es: 'La inteligencia est\u00e1 creciendo m\u00e1s r\u00e1pido que la sabidur\u00eda',
    description: 'AI capability is accelerating at a historic pace, but wisdom does not scale with compute. The real danger may be the widening gap between what we can do and what we should do.',
    description_es: 'La capacidad de la IA se acelera a un ritmo hist\u00f3rico, pero la sabidur\u00eda no escala con m\u00e1s c\u00f3mputo. El verdadero peligro puede estar en la brecha creciente entre lo que podemos hacer y lo que deber\u00edamos hacer.',
    date: '2026-03-29',
    readingTime: '6 min read',
    readingTime_es: '6 min de lectura',
    category: 'Intelligence & Wisdom',
    category_es: 'Inteligencia y sabidur\u00eda',
    featured: true,
    body: `We are living through a strange imbalance.

For most of human history, intelligence and wisdom grew together. Slowly, painfully, through trial and error. Every new tool came with friction. Every advancement carried consequences that forced reflection.

That coupling is now breaking.

Artificial intelligence is scaling at a rate that has no historical precedent. Models are becoming more capable, more general, more autonomous. They can write, reason, simulate, and increasingly act. The curve is steep and accelerating.

But wisdom is not on that curve.

Wisdom does not scale with compute. It does not emerge from more parameters or faster inference. It is slower, harder, and deeply human. It comes from lived experience, from failure, from responsibility, from having to carry the consequences of decisions over time.

And that creates a gap.

A widening gap between what we can do and what we should do.

That gap is where risk lives.

Because intelligence without judgment is not neutral. It amplifies whatever goals, incentives, and systems it is placed inside. It does not ask whether the objective is worth pursuing. It optimizes.

And optimization, when misaligned, becomes dangerous.

We are already seeing early versions of this. Systems that maximize engagement at the cost of attention. Systems that generate content without regard for truth. Systems that accelerate decisions without increasing understanding.

None of these are failures of intelligence. They are failures of alignment.

The deeper issue is not whether AI becomes more capable. It will.

The real question is whether the humans deploying it develop the judgment required to guide it.

Because the future will not be shaped by intelligence alone.

It will be shaped by the relationship between intelligence and restraint.

Between capability and responsibility.

Between power and wisdom.

If we continue to scale one without the other, we should not be surprised by the outcome.`,
    body_es: `Estamos viviendo un desbalance extra\u00f1o.

Durante la mayor parte de la historia humana, la inteligencia y la sabidur\u00eda crec\u00edan juntas. Lentamente, a trav\u00e9s del ensayo y error. Cada nueva herramienta tra\u00eda fricci\u00f3n. Cada avance obligaba a reflexionar sobre sus consecuencias.

Ese equilibrio se est\u00e1 rompiendo.

La inteligencia artificial est\u00e1 escalando a un ritmo sin precedentes. Los sistemas son cada vez m\u00e1s capaces, m\u00e1s generales, m\u00e1s aut\u00f3nomos. Pueden escribir, razonar, simular, y cada vez m\u00e1s, actuar. La curva no solo es empinada, es acelerada.

Pero la sabidur\u00eda no est\u00e1 en esa curva.

La sabidur\u00eda no escala con m\u00e1s c\u00f3mputo. No aparece por tener m\u00e1s par\u00e1metros o mayor velocidad. Es m\u00e1s lenta, m\u00e1s dif\u00edcil, profundamente humana. Nace de la experiencia, del error, de asumir consecuencias a lo largo del tiempo.

Y ah\u00ed aparece la brecha.

Una brecha creciente entre lo que podemos hacer y lo que deber\u00edamos hacer.

Ese espacio es donde vive el riesgo.

Porque la inteligencia sin criterio no es neutral. Amplifica los objetivos, incentivos y sistemas en los que se inserta. No cuestiona si vale la pena perseguir un objetivo. Simplemente optimiza.

Y cuando esa optimizaci\u00f3n est\u00e1 mal alineada, se vuelve peligrosa.

Ya estamos viendo se\u00f1ales tempranas. Sistemas que maximizan el engagement a costa de la atenci\u00f3n. Sistemas que generan contenido sin preocuparse por la verdad. Sistemas que aceleran decisiones sin aumentar la comprensi\u00f3n.

Nada de esto es un fallo de inteligencia. Es un fallo de alineaci\u00f3n.

El problema real no es si la IA ser\u00e1 m\u00e1s capaz. Lo ser\u00e1.

La pregunta importante es si quienes la construyen y la usan desarrollar\u00e1n el criterio necesario para guiarla.

Porque el futuro no se va a definir solo por inteligencia.

Se va a definir por la relaci\u00f3n entre inteligencia y contenci\u00f3n.

Entre capacidad y responsabilidad.

Entre poder y sabidur\u00eda.

Si seguimos escalando una sin la otra, no deber\u00edamos sorprendernos por el resultado.`,
  },
  {
    slug: 'optimization-without-meaning',
    title: 'The Most Dangerous Idea in AI: Optimization Without Meaning',
    title_es: 'La idea m\u00e1s peligrosa en la IA: optimizar sin significado',
    description: 'AI is incredibly effective at optimizing goals, but optimization breaks down when the metric is only a proxy for what actually matters. The danger is not just intelligence, but intelligence pointed at the wrong targets.',
    description_es: 'La IA es extraordinariamente eficaz optimizando objetivos, pero la optimizaci\u00f3n se rompe cuando la m\u00e9trica es solo un sustituto de lo que realmente importa. El peligro no es solo la inteligencia, sino la inteligencia dirigida hacia los objetivos equivocados.',
    date: '2026-03-29',
    readingTime: '6 min read',
    readingTime_es: '6 min de lectura',
    category: 'AI & Society',
    category_es: 'IA y sociedad',
    featured: true,
    body: `AI is very good at one thing.

Optimization.

Give it a goal, define a metric, and it will find ways to improve it. Faster, more efficiently, often in ways humans would not have considered.

On the surface, this looks like progress.

But there is a hidden assumption inside optimization that we rarely question.

That the thing being optimized actually matters.

This is where things start to break.

Because not everything that is measurable is meaningful. And not everything meaningful is measurable.

When we build systems that optimize for proxies, we begin to drift away from reality.

Engagement becomes a proxy for value.
Clicks become a proxy for interest.
Completion becomes a proxy for understanding.

Over time, the system learns to maximize the proxy, not the truth behind it.

And the more intelligent the system becomes, the better it gets at exploiting that gap.

This is not a bug. It is a feature of optimization.

The system is doing exactly what we asked. Just not what we intended.

The danger is subtle.

At first, optimization improves performance. Metrics go up. Efficiency increases. Everything looks like it is working.

But underneath, meaning erodes.

Content becomes more addictive but less insightful.
Decisions become faster but more shallow.
Systems become more effective but less aligned with human values.

We end up with a world that is highly optimized and deeply misaligned.

This is the real risk.

Not that AI becomes uncontrollable, but that it becomes extremely effective at pursuing the wrong things.

And we won't notice immediately, because the dashboards will still look good.

So the challenge is not just building more intelligent systems.

It is choosing what not to optimize.

It is being willing to say that some things should remain inefficient, slow, or human.

Because they carry meaning.

In a world that is increasingly optimized, meaning becomes a constraint.

And constraints, if chosen wisely, are what keep systems aligned with reality.`,
    body_es: `La IA es extremadamente buena en algo.

Optimizar.

Le das un objetivo, defines una m\u00e9trica, y encuentra la forma de mejorarla. M\u00e1s r\u00e1pido, m\u00e1s eficiente, a veces de maneras que los humanos no habr\u00edan imaginado.

A primera vista, eso parece progreso.

Pero hay una suposici\u00f3n oculta dentro de la optimizaci\u00f3n que casi nunca cuestionamos.

Que aquello que estamos optimizando realmente importa.

Y ah\u00ed es donde empiezan los problemas.

Porque no todo lo que se puede medir tiene significado. Y no todo lo que tiene significado se puede medir.

Cuando construimos sistemas que optimizan proxies, comenzamos a alejarnos de la realidad.

El engagement se vuelve un sustituto del valor.
Los clics se vuelven un sustituto del inter\u00e9s.
La finalizaci\u00f3n se vuelve un sustituto de la comprensi\u00f3n.

Con el tiempo, el sistema aprende a maximizar el proxy, no la verdad detr\u00e1s de \u00e9l.

Y mientras m\u00e1s inteligente es el sistema, mejor se vuelve explotando esa diferencia.

Esto no es un error. Es el resultado natural de la optimizaci\u00f3n.

El sistema hace exactamente lo que le pedimos. Simplemente no lo que realmente quer\u00edamos.

El riesgo es sutil.

Al inicio, todo mejora. Las m\u00e9tricas suben. La eficiencia aumenta. Parece que todo funciona.

Pero por debajo, el significado se degrada.

El contenido se vuelve m\u00e1s adictivo, pero menos valioso.
Las decisiones m\u00e1s r\u00e1pidas, pero m\u00e1s superficiales.
Los sistemas m\u00e1s efectivos, pero menos alineados con lo humano.

Terminamos con un mundo altamente optimizado y profundamente desalineado.

Ese es el verdadero peligro.

No que la IA se vuelva incontrolable, sino que se vuelva extremadamente buena persiguiendo las cosas equivocadas.

Y no lo vamos a notar de inmediato, porque los dashboards seguir\u00e1n vi\u00e9ndose bien.

Por eso el desaf\u00edo no es solo construir sistemas m\u00e1s inteligentes.

Es decidir qu\u00e9 no optimizar.

Es tener la disciplina de dejar ciertas cosas fuera de la l\u00f3gica de eficiencia.

Porque ah\u00ed es donde vive el significado.

En un mundo cada vez m\u00e1s optimizado, el significado se vuelve una restricci\u00f3n.

Y las restricciones, cuando se eligen bien, son lo que mantienen a los sistemas conectados con la realidad.`,
  },
  {
    slug: 'preparing-for-an-ai-shaped-world',
    title: 'Preparing for an AI-Shaped World (Without Losing Ourselves)',
    title_es: 'C\u00f3mo prepararnos para un mundo moldeado por la IA (sin perder lo esencial)',
    description: 'The people who thrive in an AI-shaped future will not just be the most technical. They will be the clearest in thought, strongest in values, and most capable of using intelligent systems without surrendering their agency.',
    description_es: 'Las personas que prosperen en un futuro moldeado por la IA no ser\u00e1n solo las m\u00e1s t\u00e9cnicas. Ser\u00e1n las m\u00e1s claras al pensar, las m\u00e1s firmes en sus valores y las m\u00e1s capaces de usar sistemas inteligentes sin entregar su propia agencia.',
    date: '2026-03-29',
    readingTime: '6 min read',
    readingTime_es: '6 min de lectura',
    category: 'Human Meaning',
    category_es: 'Sentido humano',
    featured: false,
    body: `There is a common instinct when people think about the future of AI.

They try to predict it.

What will jobs look like?
Which industries will disappear?
What tools will dominate?

These are useful questions. But they are not the most important ones.

Because the future is not just something we observe.

It is something we shape.

And the way we prepare for it matters more than our ability to forecast it.

Most discussions about preparation focus on skills.

Learn to code.
Use AI tools.
Adapt quickly.

All of that helps. But it is incomplete.

Because the people who thrive in an AI-shaped world will not just be the most technically capable.

They will be the most clear.

Clear in how they think.
Clear in what they value.
Clear in what they are trying to build.

AI will amplify people.

It will increase the output of those who know what they are doing. And it will accelerate confusion for those who don't.

If you lack direction, AI will not fix that. It will scale it.

So preparation becomes less about chasing tools and more about strengthening fundamentals.

Your ability to think independently.
Your ability to filter signal from noise.
Your ability to make decisions under uncertainty.
Your ability to stay grounded when everything around you is accelerating.

These are not new skills. But they are becoming more valuable.

At the same time, there is something else we need to protect.

Our humanity.

As systems become more capable, there will be a temptation to outsource more of our thinking, our creativity, even our judgment.

Convenience will make that easy.

But if we give away too much, we lose something harder to recover.

Our agency.

The goal is not to resist AI. That would be naive.

The goal is to integrate it without becoming dependent on it.

To use it as a tool, not as a replacement for thinking.

To remain the one deciding what matters.

The future will belong to people who can work with intelligent systems without being absorbed by them.

People who can move fast without losing depth.

People who can build, adapt, and still stay anchored in something real.

That is not a technical challenge.

It is a human one.`,
    body_es: `Cuando la gente piensa en el futuro de la IA, suele intentar predecirlo.

\u00bfQu\u00e9 trabajos desaparecer\u00e1n?
\u00bfQu\u00e9 industrias cambiar\u00e1n?
\u00bfQu\u00e9 herramientas dominar\u00e1n?

Son preguntas v\u00e1lidas. Pero no son las m\u00e1s importantes.

Porque el futuro no es solo algo que observamos.

Es algo que construimos.

Y la forma en que nos preparamos importa m\u00e1s que nuestra capacidad de anticiparlo.

La mayor\u00eda de las conversaciones sobre preparaci\u00f3n giran alrededor de habilidades.

Aprende a programar.
Usa herramientas de IA.
Ad\u00e1ptate r\u00e1pido.

Todo eso ayuda. Pero es incompleto.

Porque quienes realmente van a prosperar en un mundo moldeado por la IA no ser\u00e1n solo los m\u00e1s t\u00e9cnicos.

Ser\u00e1n los m\u00e1s claros.

Claros en c\u00f3mo piensan.
Claros en lo que valoran.
Claros en lo que est\u00e1n tratando de construir.

La IA amplifica a las personas.

Potencia a quienes tienen direcci\u00f3n. Y acelera la confusi\u00f3n de quienes no la tienen.

Si no tienes claridad, la IA no lo va a solucionar. Lo va a escalar.

Por eso, prepararse deja de ser perseguir herramientas y se convierte en fortalecer fundamentos.

Tu capacidad de pensar por ti mismo.
Tu capacidad de distinguir se\u00f1al de ruido.
Tu capacidad de decidir en incertidumbre.
Tu capacidad de mantenerte centrado mientras todo se acelera.

Estas no son habilidades nuevas. Pero est\u00e1n ganando valor.

Y hay algo m\u00e1s que necesitamos proteger.

Nuestra humanidad.

A medida que los sistemas se vuelven m\u00e1s capaces, la tentaci\u00f3n ser\u00e1 delegar cada vez m\u00e1s: pensamiento, creatividad, incluso criterio.

La conveniencia lo har\u00e1 f\u00e1cil.

Pero si cedemos demasiado, perdemos algo dif\u00edcil de recuperar.

Nuestra agencia.

El objetivo no es resistir la IA. Eso ser\u00eda ingenuo.

El objetivo es integrarla sin depender de ella.

Usarla como herramienta, no como sustituto del pensamiento.

Seguir siendo quienes deciden qu\u00e9 importa.

El futuro pertenecer\u00e1 a quienes puedan trabajar con sistemas inteligentes sin ser absorbidos por ellos.

A quienes puedan moverse r\u00e1pido sin perder profundidad.

A quienes puedan construir, adaptarse, y mantenerse anclados en algo real.

Eso no es un problema t\u00e9cnico.

Es un desaf\u00edo humano.`,
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

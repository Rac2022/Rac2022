import { PrismaClient } from "../src/generated/prisma/client";
import { computeOverallScore } from "../src/lib/scoring";

const prisma = new PrismaClient();

const signals = [
  {
    title: "AI-Powered Personal Stylists",
    source: "TikTok / Instagram Reels",
    sourceType: "social_media",
    url: "https://example.com/ai-stylists",
    summary:
      "Creators are showcasing AI tools that generate full outfit recommendations based on body type, occasion, and existing wardrobe photos. Engagement rates are 3-5x typical fashion content.",
    tags: "ai,fashion,personalization,saas",
    searchVolumeScore: 72,
    socialVelocityScore: 88,
    saturationScore: 25,
    monetizationEaseScore: 80,
    noveltyScore: 75,
    status: "validated",
  },
  {
    title: "Micro-SaaS for Niche Compliance",
    source: "Indie Hackers / HN",
    sourceType: "community",
    url: "https://example.com/compliance-saas",
    summary:
      "Small teams are building vertical compliance tools for specific industries (dental, cannabis, pet boarding). Low competition, high willingness to pay.",
    tags: "saas,compliance,b2b,regulation",
    searchVolumeScore: 45,
    socialVelocityScore: 52,
    saturationScore: 15,
    monetizationEaseScore: 90,
    noveltyScore: 60,
    status: "watch",
  },
  {
    title: "Prompt Engineering Marketplaces",
    source: "Product Hunt",
    sourceType: "marketplace",
    url: "https://example.com/prompt-marketplaces",
    summary:
      "Platforms where users buy and sell tested AI prompts for specific use cases. Several have launched in the past quarter with growing user bases.",
    tags: "ai,marketplace,prompts,creator-economy",
    searchVolumeScore: 82,
    socialVelocityScore: 70,
    saturationScore: 65,
    monetizationEaseScore: 60,
    noveltyScore: 45,
    status: "watch",
  },
  {
    title: "Longevity Supplements for Millennials",
    source: "Google Trends",
    sourceType: "search_trends",
    url: "https://example.com/longevity-supplements",
    summary:
      "Search interest for NMN, spermidine, and rapamycin analogs is spiking among 28-40 year olds. DTC brands are entering with subscription models.",
    tags: "health,dtc,supplements,longevity",
    searchVolumeScore: 90,
    socialVelocityScore: 65,
    saturationScore: 40,
    monetizationEaseScore: 75,
    noveltyScore: 55,
    status: "validated",
  },
  {
    title: "AI Voice Cloning for Podcasters",
    source: "Twitter / X",
    sourceType: "social_media",
    url: "https://example.com/voice-cloning",
    summary:
      "Podcasters are using voice cloning to produce multilingual versions of their shows. Several tools have emerged but no clear market leader yet.",
    tags: "ai,audio,podcasting,localization",
    searchVolumeScore: 68,
    socialVelocityScore: 78,
    saturationScore: 30,
    monetizationEaseScore: 70,
    noveltyScore: 82,
    status: "new",
  },
  {
    title: "Pet Tech Wearables",
    source: "TechCrunch",
    sourceType: "news",
    url: "https://example.com/pet-wearables",
    summary:
      "Smart collars with health monitoring, GPS, and activity tracking are seeing increased VC funding. The pet tech market is projected to grow 20% YoY.",
    tags: "pets,hardware,iot,health",
    searchVolumeScore: 75,
    socialVelocityScore: 55,
    saturationScore: 50,
    monetizationEaseScore: 55,
    noveltyScore: 40,
    status: "ignore",
  },
  {
    title: "No-Code Internal Tool Builders",
    source: "G2 / Capterra Reviews",
    sourceType: "marketplace",
    url: "https://example.com/nocode-internal",
    summary:
      "Retool alternatives focused on non-technical ops teams. Review velocity is increasing, with specific demand for HIPAA-compliant variants.",
    tags: "nocode,saas,b2b,internal-tools",
    searchVolumeScore: 70,
    socialVelocityScore: 45,
    saturationScore: 70,
    monetizationEaseScore: 80,
    noveltyScore: 30,
    status: "ignore",
  },
  {
    title: "Creator-Led Micro-Communities",
    source: "Substack / Discord trends",
    sourceType: "community",
    url: "https://example.com/micro-communities",
    summary:
      "Paid private communities (50-500 members) around specific niches are outperforming broad platforms. Tools to manage these are underbuilt.",
    tags: "community,creator-economy,saas,membership",
    searchVolumeScore: 58,
    socialVelocityScore: 72,
    saturationScore: 35,
    monetizationEaseScore: 85,
    noveltyScore: 65,
    status: "watch",
  },
  {
    title: "Sustainable Packaging as a Service",
    source: "Industry Report (McKinsey)",
    sourceType: "research",
    url: "https://example.com/sustainable-packaging",
    summary:
      "B2B packaging-as-a-service models using compostable materials are gaining traction with DTC brands facing EU regulation deadlines.",
    tags: "sustainability,b2b,packaging,regulation",
    searchVolumeScore: 50,
    socialVelocityScore: 35,
    saturationScore: 20,
    monetizationEaseScore: 65,
    noveltyScore: 70,
    status: "new",
  },
  {
    title: "AI Dungeon Masters for Tabletop RPGs",
    source: "Reddit r/DnD",
    sourceType: "community",
    url: "https://example.com/ai-dungeon-master",
    summary:
      "Tools that generate dynamic campaign narratives, NPC dialogue, and encounter balancing using LLMs. Several open-source projects gaining stars rapidly.",
    tags: "ai,gaming,tabletop,entertainment",
    searchVolumeScore: 55,
    socialVelocityScore: 80,
    saturationScore: 20,
    monetizationEaseScore: 50,
    noveltyScore: 90,
    status: "new",
  },
  {
    title: "Fractional CFO Platforms",
    source: "LinkedIn trending",
    sourceType: "social_media",
    url: "https://example.com/fractional-cfo",
    summary:
      "Marketplaces connecting startups with part-time CFOs are growing. The model is expanding beyond finance to fractional CTOs and CMOs.",
    tags: "b2b,marketplace,finance,fractional",
    searchVolumeScore: 62,
    socialVelocityScore: 48,
    saturationScore: 35,
    monetizationEaseScore: 78,
    noveltyScore: 45,
    status: "watch",
  },
  {
    title: "Hyper-Local Weather APIs for Agriculture",
    source: "AgTech Newsletter",
    sourceType: "research",
    url: "https://example.com/agri-weather",
    summary:
      "Precision agriculture is driving demand for field-level weather data APIs. Current solutions are expensive and inaccurate at micro scales.",
    tags: "agtech,api,weather,b2b",
    searchVolumeScore: 40,
    socialVelocityScore: 30,
    saturationScore: 10,
    monetizationEaseScore: 72,
    noveltyScore: 78,
    status: "new",
  },
  {
    title: "Digital Twin Fitness Coaching",
    source: "Wired Magazine",
    sourceType: "news",
    url: "https://example.com/digital-twin-fitness",
    summary:
      "Apps creating 3D body models from phone scans to track physique changes and generate personalized workout plans. Early movers seeing strong retention.",
    tags: "fitness,ai,3d,health,dtc",
    searchVolumeScore: 65,
    socialVelocityScore: 74,
    saturationScore: 22,
    monetizationEaseScore: 70,
    noveltyScore: 85,
    status: "new",
  },
  {
    title: "Second-Brain Tooling for Teams",
    source: "Hacker News",
    sourceType: "community",
    url: "https://example.com/team-second-brain",
    summary:
      "Knowledge management tools that combine personal note-taking with team wikis, using AI to surface relevant context during work. Notion + Mem hybrid space.",
    tags: "productivity,saas,ai,knowledge-management",
    searchVolumeScore: 73,
    socialVelocityScore: 60,
    saturationScore: 55,
    monetizationEaseScore: 75,
    noveltyScore: 50,
    status: "watch",
  },
];

async function main() {
  console.log("Seeding database...");

  await prisma.trendSignal.deleteMany();

  for (const signal of signals) {
    const overallScore = computeOverallScore({
      noveltyScore: signal.noveltyScore,
      socialVelocityScore: signal.socialVelocityScore,
      searchVolumeScore: signal.searchVolumeScore,
      monetizationEaseScore: signal.monetizationEaseScore,
      saturationScore: signal.saturationScore,
    });

    await prisma.trendSignal.create({
      data: {
        ...signal,
        overallScore,
      },
    });
  }

  console.log(`Seeded ${signals.length} trend signals.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

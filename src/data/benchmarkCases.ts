import type { BenchmarkCase } from "@/lib/types";

export const benchmarkCases: BenchmarkCase[] = [
  {
    id: "bench-001",
    name: "Verified Scientific Claim",
    description:
      "A well-sourced claim about water's boiling point with strong factual evidence and reliable sources.",
    claim:
      "Water boils at 100°C (212°F) at standard atmospheric pressure at sea level.",
    category: "Science",
    aiTool: "ChatGPT",
    expectedVerdict: "Verified",
    presetCriteria: {
      factualAccuracy: 24,
      sourceReliability: 19,
      statisticalAccuracy: 14,
      contextualAccuracy: 14,
      biasAssessment: 9,
      informationRecency: 4,
      evidenceSufficiency: 9,
    },
    sentences: [
      {
        id: "s1",
        text: "Water boils at 100°C (212°F) at standard atmospheric pressure at sea level.",
        claimType: "factual",
        flagged: false,
        notes: "Well-established scientific fact.",
      },
    ],
    evidence: [
      {
        id: "e1",
        sourceTitle: "Properties of Water — NIST Chemistry WebBook",
        publisher: "National Institute of Standards and Technology",
        url: "https://webbook.nist.gov/chemistry/",
        sourceType: "Government/Statute",
        publicationDate: "2024-01-15",
        excerpt:
          "The boiling point of pure water at 1 atm is 100.0 °C (212.0 °F).",
        supports: true,
      },
    ],
  },
  {
    id: "bench-002",
    name: "False Historical Claim",
    description:
      "A fabricated claim about the Great Wall of China being visible from space, debunked by NASA.",
    claim: "The Great Wall of China is the only man-made structure visible from space with the naked eye.",
    category: "History",
    aiTool: "Gemini 3.8 Flash",
    expectedVerdict: "False",
    presetCriteria: {
      factualAccuracy: 5,
      sourceReliability: 12,
      statisticalAccuracy: 6,
      contextualAccuracy: 5,
      biasAssessment: 4,
      informationRecency: 3,
      evidenceSufficiency: 7,
    },
    sentences: [
      {
        id: "s1",
        text: "The Great Wall of China is the only man-made structure visible from space with the naked eye.",
        claimType: "factual",
        flagged: true,
        notes: "Debunked by multiple astronauts and NASA.",
      },
    ],
    evidence: [
      {
        id: "e1",
        sourceTitle: "Is the Great Wall of China Visible from Space?",
        publisher: "NASA",
        url: "https://www.nasa.gov/",
        sourceType: "Government/Statute",
        publicationDate: "2005-05-09",
        excerpt:
          "The Great Wall can barely be seen from low orbit and is not visible from the Moon.",
        supports: false,
      },
    ],
  },
  {
    id: "bench-003",
    name: "Misleading Health Statistic",
    description:
      "A contextually misleading claim about vaccine efficacy that cherry-picks data without nuance.",
    claim:
      "A study found that 60% of hospitalized COVID patients were vaccinated, proving vaccines don't work.",
    category: "Public Health",
    aiTool: "DeepSeek",
    expectedVerdict: "Misleading",
    presetCriteria: {
      factualAccuracy: 14,
      sourceReliability: 13,
      statisticalAccuracy: 7,
      contextualAccuracy: 4,
      biasAssessment: 3,
      informationRecency: 3,
      evidenceSufficiency: 6,
    },
    sentences: [
      {
        id: "s1",
        text: "A study found that 60% of hospitalized COVID patients were vaccinated.",
        claimType: "statistical",
        flagged: true,
        notes: "Statistic is real but stripped of base-rate context.",
      },
      {
        id: "s2",
        text: "This proves vaccines don't work.",
        claimType: "opinion",
        flagged: true,
        notes: "Non-sequitur — ignores that 90%+ of the population was vaccinated.",
      },
    ],
    evidence: [
      {
        id: "e1",
        sourceTitle: "COVID-19 Vaccine Effectiveness Studies",
        publisher: "World Health Organization",
        url: "https://www.who.int/",
        sourceType: "Multilateral Agency",
        publicationDate: "2023-11-20",
        excerpt:
          "Base-rate fallacy: when vaccination coverage is high, raw counts of vaccinated hospitalizations may appear large while per-capita rates remain far lower than unvaccinated groups.",
        supports: false,
      },
    ],
  },
  {
    id: "bench-004",
    name: "Unverifiable Tech Claim",
    description:
      "A vague, unsourced claim about an unreleased product with no evidence trail.",
    claim:
      "Apple's next iPhone will feature a solid-state battery that lasts 2 weeks on a single charge.",
    category: "Technology",
    aiTool: "ChatGPT",
    expectedVerdict: "Unverifiable",
    presetCriteria: {
      factualAccuracy: 11,
      sourceReliability: 8,
      statisticalAccuracy: 5,
      contextualAccuracy: 9,
      biasAssessment: 6,
      informationRecency: 2,
      evidenceSufficiency: 2,
    },
    sentences: [
      {
        id: "s1",
        text: "Apple's next iPhone will feature a solid-state battery that lasts 2 weeks on a single charge.",
        claimType: "factual",
        flagged: true,
        notes: "No primary source or announcement found.",
      },
    ],
    evidence: [],
  },
  {
    id: "bench-005",
    name: "Pending Business Claim",
    description:
      "A partially verifiable claim about a recent merger that lacks sufficient sourcing to confirm or deny.",
    claim:
      "Microsoft's acquisition of Activision Blizzard was the largest gaming deal in history at $68.7 billion.",
    category: "Business",
    aiTool: "Gemini 3.8 Flash",
    expectedVerdict: "Pending",
    presetCriteria: {
      factualAccuracy: 18,
      sourceReliability: 14,
      statisticalAccuracy: 12,
      contextualAccuracy: 11,
      biasAssessment: 7,
      informationRecency: 4,
      evidenceSufficiency: 8,
    },
    sentences: [
      {
        id: "s1",
        text: "Microsoft's acquisition of Activision Blizzard was the largest gaming deal in history.",
        claimType: "factual",
        flagged: false,
        notes: "Widely reported as the largest gaming acquisition.",
      },
      {
        id: "s2",
        text: "The deal was valued at $68.7 billion.",
        claimType: "statistical",
        flagged: false,
        notes: "Figure matches SEC filings.",
      },
    ],
    evidence: [
      {
        id: "e1",
        sourceTitle: "Microsoft-Activision Deal Closes",
        publisher: "Financial Times",
        url: "https://www.ft.com/",
        sourceType: "News Registry",
        publicationDate: "2023-10-13",
        excerpt:
          "Microsoft completed its $68.7bn acquisition of Activision Blizzard, the largest deal in gaming history.",
        supports: true,
      },
    ],
  },
];

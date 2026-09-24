/**
 * BrandStory Analytics Engine – Premium Edition
 * Includes Predictive CTR, Domain detection, Tone, Keywords, Platform fit
 */

export interface KeywordDensity {
  word: string;
  count: number;
  percentage: number;
}

export interface ToneBreakdown {
  professional: number;
  analytical: number;
  creative: number;
  actionOriented: number;
}

export interface PlatformFit {
  platform: string;
  chars: number;
  limit: number;
  remaining: number;
  status: "good" | "warning" | "over";
  percentage: number;
}

export interface CTRPrediction {
  score: number;          // 0-10 scale
  expectedCTR: string;    // e.g. "4.2%"
  factors: string[];      // reasons
}

export interface BrandAnalytics {
  keywords: KeywordDensity[];
  readabilityScore: number;
  readabilityLabel: string;
  impactScore: number;
  tone: ToneBreakdown;
  wordCount: number;
  charCount: number;
  readingTimeSeconds: number;
  actionRatio: number;
  platformFits: PlatformFit[];
  domainProfile: string;
  abDivergence: {
    metricsWeight: number;
    narrativeWeight: number;
    diversityScore: number;
    recommendation: string;
  };
}

// ---------- Dictionaries ----------

const STOPWORDS = new Set([
  "the","a","an","and","or","but","in","on","at","to","for","of","with","by",
  "from","is","are","was","were","be","been","being","have","has","had","do",
  "does","did","will","would","could","should","may","might","must","shall",
  "can","this","that","these","those","i","you","he","she","it","we","they",
  "me","him","her","us","them","my","your","his","its","our","their","what",
  "which","who","whom","whose","where","when","why","how","all","each","every",
  "both","few","more","most","other","some","such","no","nor","not","only",
  "own","same","so","than","too","very","just","about","into","over","after",
  "as","if","then","also","up","out","one","two","new","using","used","use",
]);

const DATABASE_TOKENS = new Set([
  "sql","duckdb","postgresql","postgres","sqlite","mysql","mongodb","nosql",
  "window","functions","joins","aggregations","cte","subquery","index",
  "query","queries","database","schema","etl","elt","warehouse","lake",
]);

const DATASCIENCE_TOKENS = new Set([
  "python","scikit-learn","sklearn","predictive","modeling","gradient",
  "boosting","feature","importance","roc","auc","anova","regression",
  "classification","clustering","neural","network","machine","learning",
  "deep","learning","nlp","llm","pandas","numpy","jupyter","notebook",
]);

const BI_TOKENS = new Set([
  "power","bi","tableau","plotly","dashboard","dashboards","kpi","kpis",
  "excel","automation","reporting","visualization","visualisation","chart",
  "metrics","measure","dax","calculated","column","slicer","filter",
]);

const OPS_TOKENS = new Set([
  "git","github","actions","ci","cd","asyncio","rest","api","apis",
  "automation","pipeline","pipelines","docker","kubernetes","aws","azure",
  "cloud","deploy","deployment","monitoring","logging",
]);

const PROFESSIONAL_WORDS = new Set([
  "expertise","professional","strategy","strategic","results","deliver",
  "proven","track","record","leadership","collaborate","partner","solution",
  "solutions","optimize","efficient","reliable","trusted","experienced",
  "skilled","qualified","certified","industry","standard","excellence",
  "quality","stakeholder","stakeholders","roadmap","execution",
]);

const ANALYTICAL_WORDS = new Set([
  "data","analysis","analytics","metrics","measure","measured","optimize",
  "optimized","scale","scaled","performance","insight","insights","research",
  "evaluate","assess","calculate","model","algorithm","statistics",
  "statistical","evidence","quantify","benchmark","kpi","roi","efficiency",
  "accuracy","precision","correlation","trend","forecast","predict",
  ...DATABASE_TOKENS, ...DATASCIENCE_TOKENS, ...BI_TOKENS,
]);

const CREATIVE_WORDS = new Set([
  "design","designed","creative","innovate","innovative","vision","visionary",
  "imagine","craft","unique","original","inspire","inspired","story",
  "narrative","brand","aesthetic","art","artistic","express","expression",
  "bold","fresh","inventive","imaginative",
]);

const ACTION_VERBS = new Set([
  "build","built","create","created","deliver","delivered","drive","driven",
  "lead","led","manage","managed","develop","developed","implement",
  "implemented","launch","launched","scale","scaled","optimize","optimized",
  "transform","transformed","achieve","achieved","grow","grew","increase",
  "increased","improve","improved","solve","solved","design","designed",
  "engineer","engineered","execute","executed","generate","generated",
  "maximize","maximized","accelerate","accelerated","establish","established",
  "expand","expanded","analyze","analyzed","architect","architected",
  "boost","boosted","unlock","unlocked","discover","discovered",
]);

// ---------- Helpers ----------

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

function fleschScore(text: string): { score: number; label: string } {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  if (words.length === 0 || sentences.length === 0) return { score: 50, label: "Average" };

  const score = 206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (syllables / words.length);
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  let label = "College Level";
  if (clamped >= 70) label = "Easy / High School";
  else if (clamped >= 50) label = "Standard / College";
  else if (clamped >= 30) label = "Professional / Graduate";
  else label = "Complex / Executive";
  return { score: clamped, label };
}

function detectDomain(tokens: string[]): string {
  let db = 0, ds = 0, bi = 0, ops = 0;
  tokens.forEach((w) => {
    if (DATABASE_TOKENS.has(w)) db++;
    if (DATASCIENCE_TOKENS.has(w)) ds++;
    if (BI_TOKENS.has(w)) bi++;
    if (OPS_TOKENS.has(w)) ops++;
  });
  const scores = [
    { name: "Business Intelligence", score: bi },
    { name: "Data Science & ML", score: ds },
    { name: "Data Engineering", score: db },
    { name: "Platform / DevOps", score: ops },
  ];
  scores.sort((a, b) => b.score - a.score);
  return scores[0].score > 0 ? scores[0].name : "General Professional";
}

// ---------- Predictive CTR Model ----------

export function predictCTR(hook: string, body: string, cta: string): CTRPrediction {
  let score = 3.0; // baseline
  const factors: string[] = [];

  const full = `${hook} ${body} ${cta}`;
  const tokens = tokenize(full);

  // 1. Presence of numbers / metrics (strong CTR driver)
  const hasNumbers = /\d+([.,]\d+)?%?|\d+k\+?|\d+x/i.test(full);
  if (hasNumbers) {
    score += 1.4;
    factors.push("Contains metrics/numbers");
  }

  // 2. Strong action verbs
  const actionCount = tokens.filter((t) => ACTION_VERBS.has(t)).length;
  if (actionCount >= 3) {
    score += 1.2;
    factors.push("Strong action verbs");
  } else if (actionCount >= 1) {
    score += 0.6;
    factors.push("Some action language");
  }

  // 3. Optimal hook length (6–14 words is sweet spot)
  const hookWords = hook.trim().split(/\s+/).length;
  if (hookWords >= 6 && hookWords <= 14) {
    score += 1.0;
    factors.push("Optimal hook length");
  } else if (hookWords < 6) {
    score += 0.3;
  }

  // 4. CTA presence and strength
  if (cta && cta.length > 8) {
    score += 0.8;
    factors.push("Clear call-to-action");
  }

  // 5. Line breaks / scannability
  if ((body.match(/\n/g) || []).length >= 1 || body.length < 220) {
    score += 0.5;
    factors.push("Scannable structure");
  }

  // 6. Question in hook (curiosity)
  if (/\?/.test(hook)) {
    score += 0.7;
    factors.push("Curiosity question");
  }

  // Clamp 0–10
  score = Math.max(1, Math.min(10, Math.round(score * 10) / 10));

  // Map to expected CTR range (rough social media benchmarks)
  const expectedCTR = (1.2 + score * 0.55).toFixed(1) + "%";

  return { score, expectedCTR, factors };
}

// ---------- Main Analysis ----------

export function analyzeBrandContent(
  storyText: string,
  headline: string = "",
  ads: { platform: string; hook: string; body: string; cta: string }[] = []
): BrandAnalytics {
  const fullText = [storyText, headline, ...ads.map((a) => `${a.hook} ${a.body} ${a.cta}`)].join(" ");
  const tokens = tokenize(fullText);
  const wordCount = fullText.split(/\s+/).filter((w) => w.length > 0).length;
  const charCount = fullText.length;

  const freq: Record<string, number> = {};
  tokens.forEach((w) => { freq[w] = (freq[w] || 0) + 1; });
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const totalTokens = tokens.length || 1;
  const keywords: KeywordDensity[] = sorted.map(([word, count]) => ({
    word, count, percentage: Math.round((count / totalTokens) * 1000) / 10,
  }));

  const { score: readabilityScore, label: readabilityLabel } = fleschScore(storyText);

  let professional = 0, analytical = 0, creative = 0, actionCount = 0;
  tokens.forEach((w) => {
    if (PROFESSIONAL_WORDS.has(w)) professional++;
    if (ANALYTICAL_WORDS.has(w)) analytical++;
    if (CREATIVE_WORDS.has(w)) creative++;
    if (ACTION_VERBS.has(w)) actionCount++;
  });

  const toneTotal = professional + analytical + creative || 1;
  const tone: ToneBreakdown = {
    professional: Math.round((professional / toneTotal) * 100),
    analytical: Math.round((analytical / toneTotal) * 100),
    creative: Math.round((creative / toneTotal) * 100),
    actionOriented: Math.round((actionCount / (tokens.length || 1)) * 100),
  };

  const impactScore = Math.min(100, Math.round(
    readabilityScore * 0.25 + tone.actionOriented * 0.3 + Math.min(keywords.length * 6, 30) + (analytical > 3 ? 15 : 0)
  ));

  const readingTimeSeconds = Math.max(5, Math.round((wordCount / 200) * 60));
  const domainProfile = detectDomain(tokens);

  const platformLimits: Record<string, number> = {
    linkedin: 3000, instagram: 2200, facebook: 63206, x: 280,
  };

  const platformFits: PlatformFit[] = ads.map((ad) => {
    const text = `${ad.hook}\n\n${ad.body}\n\n${ad.cta}`;
    const chars = text.length;
    const limit = platformLimits[ad.platform] || 1000;
    const remaining = limit - chars;
    const percentage = Math.min(100, Math.round((chars / limit) * 100));
    let status: "good" | "warning" | "over" = "good";
    if (remaining < 0) status = "over";
    else if (percentage > 85) status = "warning";
    return { platform: ad.platform, chars, limit, remaining, status, percentage };
  });

  if (headline) {
    platformFits.unshift({
      platform: "linkedin-headline",
      chars: headline.length,
      limit: 220,
      remaining: 220 - headline.length,
      status: headline.length > 220 ? "over" : headline.length > 180 ? "warning" : "good",
      percentage: Math.min(100, Math.round((headline.length / 220) * 100)),
    });
  }

  // A/B Divergence (Metrics vs Narrative weights)
  const metricsWeight = Math.round((tone.analytical * 0.6 + tone.actionOriented * 0.4));
  const narrativeWeight = Math.round((tone.creative * 0.55 + tone.professional * 0.45));
  const diversityScore = Math.min(100, Math.round(
    (Object.keys(freq).length / Math.max(tokens.length, 1)) * 180
  ));

  let recommendation = "Balanced approach works well.";
  if (metricsWeight > narrativeWeight + 15) {
    recommendation = "Copy leans Metrics-heavy (Variant A style). Strong for technical audiences.";
  } else if (narrativeWeight > metricsWeight + 15) {
    recommendation = "Copy leans Narrative-heavy (Variant B style). Strong for storytelling & brand.";
  }

  return {
    keywords,
    readabilityScore,
    readabilityLabel,
    impactScore,
    tone,
    wordCount,
    charCount,
    readingTimeSeconds,
    actionRatio: tone.actionOriented,
    platformFits,
    domainProfile,
    abDivergence: {
      metricsWeight,
      narrativeWeight,
      diversityScore,
      recommendation,
    },
  };
}

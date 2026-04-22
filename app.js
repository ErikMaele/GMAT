const STORAGE_KEY_V2 = "erik-gmat-optimizer-v2";
const STORAGE_KEY_V1 = "erik-gmat-optimizer-v1";
const SCHEMA_VERSION = 4;

const failureCauses = [
  { id: "concept_gap", label: "Concept gap", family: "Concept" },
  { id: "translation_setup", label: "Translation / setup", family: "Process" },
  { id: "execution_algebra", label: "Execution / algebra", family: "Process" },
  { id: "data_reading", label: "Data reading", family: "Process" },
  { id: "rushed_read", label: "Rushed read", family: "Timing" },
  { id: "overinvestment", label: "Overinvestment", family: "Timing" },
  { id: "trap_answer", label: "Trap answer", family: "Process" },
  { id: "careless", label: "Careless", family: "Process" },
  { id: "unknown", label: "Unknown", family: "Unknown" }
];

const trainingStates = [
  { id: "new", label: "New" },
  { id: "due", label: "Due" },
  { id: "failed_redo", label: "Failed redo" },
  { id: "improving", label: "Improving" },
  { id: "mastered", label: "Mastered" }
];

const topics = [
  {
    id: "alg-word",
    name: "Algebra word problems",
    section: "Quant",
    baseline: 53,
    priority: 1,
    targetAccuracy: 85,
    targetSeconds: 128,
    ttpModule: "Algebra",
    assignment: "Word Problems / Variables in Context",
    labels: ["algebra word", "word problem", "real context", "equation", "linear equation"]
  },
  {
    id: "value-order-factors",
    name: "Value / Order / Factors",
    section: "Quant",
    baseline: 45,
    priority: 1,
    targetAccuracy: 85,
    targetSeconds: 125,
    ttpModule: "Number Properties",
    assignment: "Value, Order, Factors, Divisibility",
    labels: ["value", "order", "factor", "divisibility", "prime", "inequality", "number properties"]
  },
  {
    id: "rates-ratios-percent",
    name: "Rates / Ratios / Percent",
    section: "Quant",
    baseline: 51,
    priority: 1,
    targetAccuracy: 84,
    targetSeconds: 125,
    ttpModule: "Rates, Ratios, and Percents",
    assignment: "Mixed application tests",
    labels: ["rate", "ratio", "percent", "percentage", "work rate", "mixture"]
  },
  {
    id: "graphs-tables",
    name: "Graphs and Tables",
    section: "DI",
    baseline: 61,
    priority: 1,
    targetAccuracy: 86,
    targetSeconds: 135,
    ttpModule: "Data Insights",
    assignment: "Graphs and Tables chart-reading sets",
    labels: ["graph", "table", "chart", "graphics", "data interpretation"]
  },
  {
    id: "multi-source",
    name: "Multi-Source Reasoning",
    section: "DI",
    baseline: 74,
    priority: 2,
    targetAccuracy: 84,
    targetSeconds: 140,
    ttpModule: "Data Insights",
    assignment: "Multi-Source Reasoning sets",
    labels: ["multi-source", "multi source", "msr", "source reasoning"]
  },
  {
    id: "two-part",
    name: "Two-Part Analysis",
    section: "DI",
    baseline: 79,
    priority: 3,
    targetAccuracy: 84,
    targetSeconds: 135,
    ttpModule: "Data Insights",
    assignment: "Two-Part Analysis mixed sets",
    labels: ["two-part", "two part", "2-part", "two part analysis"]
  },
  {
    id: "data-sufficiency",
    name: "Data Sufficiency",
    section: "DI",
    baseline: 81,
    priority: 3,
    targetAccuracy: 85,
    targetSeconds: 130,
    ttpModule: "Data Insights",
    assignment: "Data Sufficiency logic sets",
    labels: ["data sufficiency", "sufficiency", "ds"]
  },
  {
    id: "verbal-maintenance",
    name: "Verbal maintenance",
    section: "Verbal",
    baseline: 97,
    priority: 5,
    targetAccuracy: 90,
    targetSeconds: 115,
    ttpModule: "Verbal",
    assignment: "Light CR/RC maintenance only",
    labels: ["verbal", "critical reasoning", "reading comprehension", "cr", "rc"]
  },
  {
    id: "unknown",
    name: "Unknown / needs classification",
    section: "Unknown",
    baseline: 50,
    priority: 3,
    targetAccuracy: 80,
    targetSeconds: 130,
    ttpModule: "Unknown",
    assignment: "Classify before assigning",
    labels: []
  }
];

const ttpModules = topics
  .filter((topic) => topic.id !== "unknown")
  .map((topic) => ({
    id: `ttp-${topic.id}`,
    source: "TTP",
    normalizedTopic: topic.id,
    module: topic.ttpModule,
    label: topic.assignment,
    targetAccuracy: topic.targetAccuracy,
    targetSeconds: topic.targetSeconds,
    priority: topic.priority
  }));

const oxfordMuses = [
  {
    title: "Radcliffe Square",
    kicker: "Architecture",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Oxford_-_Radcliffe_Square_-_View_South_towards_University_Church_of_St_Mary_the_Virgin_along_%28right%29_the_Radcliffe_Camera_1737-48_by_James_Gibbs_%26_%28left%29_All_Souls_College_1438.jpg/1280px-Oxford_-_Radcliffe_Square_-_View_South_towards_University_Church_of_St_Mary_the_Virgin_along_%28right%29_the_Radcliffe_Camera_1737-48_by_James_Gibbs_%26_%28left%29_All_Souls_College_1438.jpg",
    quote: "Make the score feel smaller than the room you want to enter.",
    person: "Daily rule"
  },
  {
    title: "Oscar Wilde",
    kicker: "Magdalen College",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Oscar_Wilde_portrait_by_Napoleon_Sarony_-_albumen.jpg",
    quote: "The truth is rarely pure and never simple.",
    person: "Oscar Wilde"
  },
  {
    title: "John Locke",
    kicker: "Christ Church",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/John%20Locke%20by%20Sir%20Godfrey%20Kneller%2C%20Bt.jpg?width=700",
    quote: "No man's knowledge here can go beyond his experience.",
    person: "John Locke"
  },
  {
    title: "Adam Smith",
    kicker: "Balliol College",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Adam%20Smith%20The%20Muir%20portrait%20%28cropped%202%29.jpg?width=700",
    quote: "Science is the great antidote to enthusiasm and superstition.",
    person: "Adam Smith"
  },
  {
    title: "Bridge of Sighs",
    kicker: "Hertford College",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/University%20Of%20Oxford%20The%20Bridge%20Of%20Sighs.jpg?width=1000",
    quote: "A good system lets the hard work feel inevitable.",
    person: "Bridge note"
  },
  {
    title: "Duke Humfrey's Library",
    kicker: "Bodleian Library",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Duke%20Humfrey%27s%20Library%20Interior%206%2C%20Bodleian%20Library%2C%20Oxford%2C%20UK%20-%20Diliff.jpg?width=1000",
    quote: "Old mistakes belong on the shelf only after you can retrieve them.",
    person: "Memory rule"
  },
  {
    title: "All Souls",
    kicker: "Radcliffe Square",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Oxford%20-%20All%20Souls%20College%20-%20from%20Radcliffe%20square.jpg?width=1000",
    quote: "Quiet repetition is how ambition becomes evidence.",
    person: "Practice rule"
  }
];

const sectionOptions = ["Quant", "DI", "Verbal", "Unknown"];
const reviewIntervals = [1, 3, 7, 14, 30];
const desiredRetention = 0.9;
const reviewRatings = {
  again: { label: "Again", intervalMove: -99, miss: true, state: "failed_redo" },
  hard: { label: "Hard", intervalMove: 0, miss: false, state: "improving" },
  good: { label: "Good", intervalMove: 1, miss: false, state: "improving" },
  easy: { label: "Easy", intervalMove: 2, miss: false, state: "improving" }
};

const sectionBlueprint = {
  Quant: { label: "Quantitative Reasoning", questions: 21, minutes: 45, avgSeconds: 129, calculator: "No calculator" },
  Verbal: { label: "Verbal Reasoning", questions: 23, minutes: 45, avgSeconds: 117, calculator: "No calculator" },
  DI: { label: "Data Insights", questions: 20, minutes: 45, avgSeconds: 135, calculator: "On-screen calculator" },
  Unknown: { label: "Mixed practice", questions: 15, minutes: 30, avgSeconds: 120, calculator: "Source rules" }
};

const defaultState = {
  schemaVersion: SCHEMA_VERSION,
  profile: {
    baselineTotal: 655,
    targetTotal: 745,
    targetExamDate: "2026-06-27",
    absoluteLatest: "2026-07-15",
    workStart: "2026-05-04",
    baseline: { Quant: 80, Verbal: 87, DI: 81 },
    target: { Quant: 89, Verbal: 87, DI: 89 }
  },
  sessions: [
    {
      id: "seed-dec-official",
      kind: "PracticeSession",
      date: "2025-12-31",
      source: "mba.com Official",
      sourceLabel: "Official attempt",
      section: "Official",
      topic: "unknown",
      questions: 64,
      correct: 0,
      wrong: 0,
      uncertain: 0,
      minutes: 135,
      avgSeconds: 126,
      difficulty: "Official",
      setType: "Baseline",
      notes: "Official 655: Q80, V87, DI81."
    }
  ],
  questionAttempts: [],
  mistakeCards: [
    {
      id: "seed-graphs",
      kind: "MistakeCard",
      date: "2026-04-21",
      source: "ESR",
      sourceLabel: "Graphs and Tables",
      section: "DI",
      topic: "graphs-tables",
      failureCause: "rushed_read",
      trainingState: "due",
      timingFlag: "fast_wrong",
      confidence: 0.82,
      seconds: 55,
      reference: "ESR: Graphs and Tables",
      lesson: "Read title and axes, units, trend direction, and outliers before touching the answer choices.",
      nextReview: "2026-04-22",
      intervalIndex: 0,
      attempts: 0,
      misses: 0
    },
    {
      id: "seed-algebra",
      kind: "MistakeCard",
      date: "2026-04-21",
      source: "ESR",
      sourceLabel: "Algebra / Real Contexts",
      section: "Quant",
      topic: "alg-word",
      failureCause: "translation_setup",
      trainingState: "due",
      timingFlag: "too_slow",
      confidence: 0.78,
      seconds: 230,
      reference: "ESR: Algebra and Real Contexts",
      lesson: "Name variables before manipulating equations. Separate translation errors from algebra errors.",
      nextReview: "2026-04-22",
      intervalIndex: 0,
      attempts: 0,
      misses: 0
    }
  ],
  importBatches: [],
  activeBlock: null,
  guidedBlocks: [],
  mocks: [
    {
      id: "official-dec",
      kind: "MockResult",
      label: "Official attempt",
      date: "2025-12-31",
      source: "mba.com",
      purpose: "Baseline",
      status: "completed",
      score: "655",
      split: "Q80 / V87 / DI81"
    },
    {
      id: "m1",
      kind: "MockResult",
      label: "M1",
      date: "2026-04-27",
      source: "Official Exam 1",
      purpose: "Diagnostic after reset",
      status: "planned",
      score: "",
      split: ""
    },
    {
      id: "m2",
      kind: "MockResult",
      label: "M2",
      date: "2026-05-17",
      source: "Official",
      purpose: "First checkpoint",
      status: "planned",
      score: "",
      split: ""
    },
    {
      id: "m3",
      kind: "MockResult",
      label: "M3",
      date: "2026-05-24",
      source: "Official",
      purpose: "Mid-prep check",
      status: "planned",
      score: "",
      split: ""
    },
    {
      id: "m4",
      kind: "MockResult",
      label: "M4",
      date: "2026-05-31",
      source: "Official",
      purpose: "End-of-May benchmark",
      status: "planned",
      score: "",
      split: ""
    },
    {
      id: "m5",
      kind: "MockResult",
      label: "M5",
      date: "2026-06-07",
      source: "GMAT Club",
      purpose: "Third-party stamina",
      status: "planned",
      score: "",
      split: ""
    },
    {
      id: "m6",
      kind: "MockResult",
      label: "M6",
      date: "2026-06-14",
      source: "Official",
      purpose: "Pre-final check",
      status: "planned",
      score: "",
      split: ""
    },
    {
      id: "m7",
      kind: "MockResult",
      label: "M7",
      date: "2026-06-21",
      source: "GMAT Club",
      purpose: "Final tune",
      status: "planned",
      score: "",
      split: ""
    },
    {
      id: "real",
      kind: "MockResult",
      label: "Exam",
      date: "2026-06-27",
      source: "Real GMAT",
      purpose: "Target window",
      status: "real",
      score: "735-745",
      split: "Q89 / V87 / DI89"
    }
  ]
};

let state = loadState();
let selectedScreenshot = null;
let lastParsedImport = null;
let activeReviewId = null;
let activeReviewRevealed = false;
let blockTicker = null;

function uid(prefix = "id") {
  const random = crypto && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${random}`;
}

function loadState() {
  const v2 = localStorage.getItem(STORAGE_KEY_V2);
  if (v2) {
    try {
      return normalizeState(JSON.parse(v2));
    } catch {
      return structuredClone(defaultState);
    }
  }
  const v1 = localStorage.getItem(STORAGE_KEY_V1);
  if (v1) {
    try {
      const migrated = migrateV1(JSON.parse(v1));
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(migrated));
      return migrated;
    } catch {
      return structuredClone(defaultState);
    }
  }
  return structuredClone(defaultState);
}

function migrateV1(saved) {
  const next = structuredClone(defaultState);
  if (saved.profile) next.profile = { ...next.profile, ...saved.profile };
  if (Array.isArray(saved.sessions)) {
    next.sessions = saved.sessions.map((session) => sessionToV2(session));
  }
  if (Array.isArray(saved.errors)) {
    next.mistakeCards = saved.errors.map((error) => errorToCard(error));
  }
  if (Array.isArray(saved.mocks)) next.mocks = saved.mocks;
  next.schemaVersion = SCHEMA_VERSION;
  return normalizeState(next);
}

function sessionToV2(session) {
  const questions = Number(session.questions || 0);
  const correct = Number(session.correct || 0);
  const minutes = Number(session.minutes || 0);
  const topicId = topics.some((topic) => topic.id === session.topic)
    ? session.topic
    : normalizeTopic(session.topic || session.sourceLabel || session.notes).topic;
  return {
    id: session.id || uid("session"),
    kind: "PracticeSession",
    date: session.date || todayISO(),
    source: session.source || "Custom",
    sourceLabel: session.sourceLabel || topicName(session.topic) || session.topic || "Imported session",
    section: session.section || getTopic(session.topic).section,
    topic: topicId,
    questions,
    correct,
    wrong: Math.max(0, questions - correct),
    uncertain: Number(session.uncertain || 0),
    minutes,
    avgSeconds: questions ? Math.round((minutes * 60) / questions) : 0,
    difficulty: session.difficulty || "Mixed",
    setType: session.focus || session.setType || "Timed drill",
    notes: session.notes || ""
  };
}

function errorToCard(error) {
  const topic = topics.some((item) => item.id === error.topic)
    ? error.topic
    : normalizeTopic(error.topic || error.reference || error.lesson).topic;
  const seconds = Number(error.seconds || 0);
  return {
    id: error.id || uid("card"),
    kind: "MistakeCard",
    date: error.date || todayISO(),
    source: error.source || "Custom",
    sourceLabel: error.reference || topicName(topic),
    section: error.section || getTopic(topic).section,
    topic,
    failureCause: normalizeFailureCause(error.errorType || error.failureCause || error.lesson),
    trainingState: error.trainingState || "due",
    timingFlag: inferTimingFlag(seconds, getTopic(topic), false),
    confidence: Number(error.confidence || 0.65),
    seconds,
    reference: error.reference || "",
    lesson: error.lesson || "",
    nextReview: error.nextReview || todayISO(),
    intervalIndex: Number(error.intervalIndex || 0),
    attempts: Number(error.attempts || 0),
    misses: Number(error.misses || 0),
    lastRating: error.lastRating || "",
    reviewedAt: error.reviewedAt || "",
    ease: Number(error.ease || 2.5)
  };
}

function normalizeState(input) {
  const base = structuredClone(defaultState);
  const merged = {
    ...base,
    ...input,
    schemaVersion: SCHEMA_VERSION,
    profile: { ...base.profile, ...(input.profile || {}) },
    sessions: Array.isArray(input.sessions) ? input.sessions.map(sessionToV2) : base.sessions,
    questionAttempts: Array.isArray(input.questionAttempts) ? input.questionAttempts : base.questionAttempts,
    mistakeCards: Array.isArray(input.mistakeCards)
      ? input.mistakeCards.map(errorToCard)
      : Array.isArray(input.errors)
        ? input.errors.map(errorToCard)
        : base.mistakeCards,
    importBatches: Array.isArray(input.importBatches) ? input.importBatches : base.importBatches,
    activeBlock: input.activeBlock || base.activeBlock,
    guidedBlocks: Array.isArray(input.guidedBlocks) ? input.guidedBlocks : base.guidedBlocks,
    mocks: Array.isArray(input.mocks) ? input.mocks : base.mocks
  };
  return merged;
}

function saveState() {
  state.schemaVersion = SCHEMA_VERSION;
  localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(state));
}

function byId(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function todayISO() {
  return toISO(new Date());
}

function toISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(value) {
  const [year, month, day] = String(value || todayISO()).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function dateDiff(a, b) {
  return Math.ceil((parseDate(b) - parseDate(a)) / 86400000);
}

function formatDate(value) {
  return parseDate(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function addDays(value, days) {
  const date = parseDate(value);
  date.setDate(date.getDate() + days);
  return toISO(date);
}

function getTopic(id) {
  return topics.find((topic) => topic.id === id) || topics.find((topic) => topic.id === "unknown");
}

function topicName(id) {
  return getTopic(id).name;
}

function causeLabel(id) {
  return (failureCauses.find((cause) => cause.id === id) || failureCauses.at(-1)).label;
}

function causeFamily(id) {
  return (failureCauses.find((cause) => cause.id === id) || failureCauses.at(-1)).family;
}

function stateLabel(id) {
  return (trainingStates.find((item) => item.id === id) || trainingStates[0]).label;
}

function normalizeText(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9%/.\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeTopic(value) {
  const text = normalizeText(value);
  if (!text) return { topic: "unknown", confidence: 0.15, matched: "" };
  let best = { topic: "unknown", confidence: 0.2, matched: "" };
  topics.forEach((topic) => {
    topic.labels.forEach((label) => {
      if (text.includes(label)) {
        const score = Math.min(0.95, 0.56 + Math.min(label.length / 30, 0.28) + (topic.priority === 1 ? 0.08 : 0));
        if (score > best.confidence) best = { topic: topic.id, confidence: score, matched: label };
      }
    });
  });
  return best;
}

function normalizeFailureCause(value) {
  const text = normalizeText(value);
  if (text.includes("translation") || text.includes("setup")) return "translation_setup";
  if (text.includes("manipulation") || text.includes("execution") || text.includes("calculation error")) return "execution_algebra";
  if (text.includes("rushed") || text.includes("read")) return "rushed_read";
  if (text.includes("concept")) return "concept_gap";
  if (text.includes("trap")) return "trap_answer";
  if (text.includes("careless")) return "careless";
  if (text.includes("data") || text.includes("chart") || text.includes("graph")) return "data_reading";
  if (text.includes("slow") || text.includes("over")) return "overinvestment";
  return "unknown";
}

function sessionsForTopic(topicId) {
  return state.sessions.filter((session) => session.topic === topicId && session.questions > 0);
}

function cardsForTopic(topicId) {
  return state.mistakeCards.filter((card) => card.topic === topicId);
}

function dueCards(date = todayISO()) {
  return state.mistakeCards.filter((card) => card.trainingState !== "mastered" && card.nextReview <= date);
}

function cardLastTouch(card) {
  return card.reviewedAt || card.date || todayISO();
}

function cardStability(card) {
  const interval = reviewIntervals[Math.max(0, Number(card.intervalIndex || 0))] || 1;
  const ease = Math.max(1.3, Number(card.ease || 2.5));
  const lapsePenalty = Math.max(0.35, 1 - Number(card.misses || 0) * 0.12);
  return Math.max(1, interval * ease * lapsePenalty);
}

function predictedRetrievability(card, date = todayISO()) {
  if (card.trainingState === "mastered") return 1;
  const elapsed = Math.max(0, dateDiff(cardLastTouch(card), date));
  const stability = cardStability(card);
  return Math.max(0.05, Math.min(0.99, Math.exp(Math.log(desiredRetention) * (elapsed / stability))));
}

function memoryRiskScore(card, date = todayISO()) {
  if (card.trainingState === "mastered") return 0;
  const recallGap = Math.max(0, desiredRetention - predictedRetrievability(card, date)) * 100;
  const overdue = Math.max(0, -dateDiff(date, card.nextReview || date));
  const missLoad = Number(card.misses || 0) * 8;
  const uncertainty = card.timingFlag === "uncertain_correct" || card.trainingState === "failed_redo" ? 7 : 0;
  return Math.round(recallGap + overdue * 4 + missLoad + uncertainty);
}

function memoryRiskCards(date = todayISO()) {
  return state.mistakeCards
    .filter((card) => card.trainingState !== "mastered")
    .map((card) => ({ card, risk: memoryRiskScore(card, date), recall: predictedRetrievability(card, date) }))
    .filter((item) => item.risk > 0 || item.card.nextReview <= date)
    .sort((a, b) => b.risk - a.risk || a.card.nextReview.localeCompare(b.card.nextReview));
}

function memoryRiskForTopic(topicId) {
  return memoryRiskCards()
    .filter((item) => item.card.topic === topicId)
    .slice(0, 4)
    .reduce((sum, item) => sum + item.risk, 0);
}

function topicDueCount(topicId, date = todayISO()) {
  return cardsForTopic(topicId).filter((card) => card.trainingState !== "mastered" && card.nextReview <= date).length;
}

function topicAccuracy(topicId) {
  const recent = sessionsForTopic(topicId).slice(-8);
  const questions = recent.reduce((sum, item) => sum + Number(item.questions || 0), 0);
  const correct = recent.reduce((sum, item) => sum + Number(item.correct || 0), 0);
  if (!questions) return null;
  return Math.round((correct / questions) * 100);
}

function averageSeconds(topicId) {
  const recent = sessionsForTopic(topicId).slice(-8);
  const questions = recent.reduce((sum, item) => sum + Number(item.questions || 0), 0);
  const seconds = recent.reduce((sum, item) => sum + Number(item.avgSeconds || 0) * Number(item.questions || 0), 0);
  if (!questions) return null;
  return Math.round(seconds / questions);
}

function reviewFailureRate(topicId) {
  const cards = cardsForTopic(topicId);
  const attempts = cards.reduce((sum, card) => sum + Number(card.attempts || 0), 0);
  const misses = cards.reduce((sum, card) => sum + Number(card.misses || 0), 0);
  if (!attempts) return 0;
  return misses / attempts;
}

function recencyPenalty(topicId) {
  const last = sessionsForTopic(topicId).sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!last) return 8;
  return Math.min(12, Math.max(0, dateDiff(last.date, todayISO()) / 2));
}

function topicRisk(topic) {
  if (topic.id === "unknown") return state.mistakeCards.some((card) => card.topic === "unknown") ? 58 : 0;
  const accuracy = topicAccuracy(topic.id);
  const avgSec = averageSeconds(topic.id);
  const baselineGap = Math.max(0, 100 - topic.baseline);
  const priorityBoost = (6 - topic.priority) * 7;
  const accuracyGap = accuracy == null ? 10 : Math.max(0, topic.targetAccuracy - accuracy) * 1.5;
  const timeGap = avgSec == null ? 3 : Math.max(0, avgSec - topic.targetSeconds) / 3.5;
  const dueGap = topicDueCount(topic.id) * 9;
  const memoryGap = memoryRiskForTopic(topic.id) / 4;
  const reviewGap = reviewFailureRate(topic.id) * 26;
  return Math.round(baselineGap + priorityBoost + accuracyGap + timeGap + dueGap + memoryGap + reviewGap + recencyPenalty(topic.id));
}

function riskSeverity(risk) {
  if (risk >= 92) return "critical";
  if (risk >= 72) return "high";
  if (risk >= 48) return "medium";
  return "low";
}

function riskLabel(risk) {
  const severity = riskSeverity(risk);
  return severity.charAt(0).toUpperCase() + severity.slice(1);
}

function rankedTopics() {
  return topics
    .filter((topic) => topic.id !== "verbal-maintenance" || verbalNeedsWork())
    .map((topic) => ({ ...topic, risk: topicRisk(topic) }))
    .sort((a, b) => b.risk - a.risk);
}

function adaptiveMix(totalCount = exactAssignment().count) {
  const ranked = rankedTopics().filter((topic) => topic.id !== "unknown" && topic.id !== "verbal-maintenance").slice(0, 3);
  const weights = [0.5, 0.3, 0.2];
  let remaining = Number(totalCount || 0);
  return ranked.map((topic, index) => {
    const count = index === ranked.length - 1 ? remaining : Math.max(2, Math.round(totalCount * weights[index]));
    remaining = Math.max(0, remaining - count);
    return {
      topic,
      count,
      mode: topic.section === "DI" ? "chart/process reps" : "quant reps",
      target: `${topic.targetAccuracy}% / ${topic.targetSeconds}s`
    };
  });
}

function topicMastery(topicId) {
  const topic = getTopic(topicId);
  const accuracy = topicAccuracy(topicId);
  const seconds = averageSeconds(topicId);
  const due = topicDueCount(topicId);
  const failures = reviewFailureRate(topicId);
  if (due > 0 || failures > 0.25) return { label: "Repair", className: "repair" };
  if (accuracy == null) return { label: "Unseen", className: "unseen" };
  if (accuracy >= topic.targetAccuracy && seconds && seconds <= topic.targetSeconds + 10) return { label: "Mastery", className: "mastery" };
  if (accuracy >= topic.targetAccuracy - 6) return { label: "Calibrate", className: "calibrate" };
  return { label: "Build", className: "build" };
}

function leechCards() {
  return state.mistakeCards.filter((card) => card.trainingState !== "mastered" && Number(card.misses || 0) >= 2);
}

function activityDates() {
  const dates = new Set();
  state.sessions.forEach((session) => {
    if (session.date) dates.add(session.date);
  });
  state.importBatches.forEach((batch) => {
    if (batch.date) dates.add(batch.date);
    if (batch.savedAt) dates.add(batch.savedAt);
  });
  state.mistakeCards.forEach((card) => {
    if (card.reviewedAt) dates.add(card.reviewedAt);
  });
  return [...dates].sort();
}

function studyStreak() {
  const dates = new Set(activityDates());
  let streak = 0;
  let cursor = todayISO();
  while (dates.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

function estimatedScoreBand() {
  const quant = sectionReadiness("Quant");
  const di = sectionReadiness("DI");
  const verbal = verbalNeedsWork() ? sectionReadiness("Verbal") : 95;
  const readiness = Math.round(quant * 0.42 + di * 0.38 + verbal * 0.2);
  const baseline = Number(state.profile.baselineTotal || 655);
  const target = Number(state.profile.targetTotal || 745);
  const center = Math.round(baseline + (target - baseline) * Math.min(1, readiness / 100));
  const mockScores = state.mocks
    .map((mock) => Number(String(mock.score || "").match(/\d+/)?.[0] || 0))
    .filter((score) => score >= 400 && score <= 805);
  const latestMock = mockScores.at(-1);
  const anchored = latestMock ? Math.round(center * 0.55 + latestMock * 0.45) : center;
  return {
    low: Math.max(605, anchored - 15),
    high: Math.min(target, anchored + 15),
    readiness
  };
}

function reviewCap() {
  const mode = getDayMode();
  if (mode === "Norvestor evening") return 12;
  if (mode === "Weekend deep work") return 28;
  if (mode === "Full-time sprint") return 32;
  return 8;
}

function verbalNeedsWork() {
  return state.mocks.some((mock) => /v8[0-4]\b/i.test(mock.split || ""));
}

function sectionReadiness(section) {
  const sectionTopics = topics.filter((topic) => topic.section === section && topic.id !== "unknown");
  if (!sectionTopics.length) return 0;
  const scores = sectionTopics.map((topic) => {
    const acc = topicAccuracy(topic.id);
    const pace = averageSeconds(topic.id);
    const accuracyScore = acc == null ? 45 : Math.min(100, Math.round((acc / topic.targetAccuracy) * 100));
    const paceScore = pace == null ? 55 : Math.max(20, Math.min(100, Math.round((topic.targetSeconds / pace) * 100)));
    const reviewDebt = Math.min(35, topicDueCount(topic.id) * 8 + reviewFailureRate(topic.id) * 20);
    return Math.max(0, Math.round(accuracyScore * 0.62 + paceScore * 0.28 - reviewDebt));
  });
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function reviewDebtLabel() {
  const due = dueCards().length;
  if (due === 0) return "Clear";
  if (due <= 4) return "Light";
  if (due <= 10) return "Heavy";
  return "Critical";
}

function pacingRisk() {
  const tracked = topics.filter((topic) => topic.id !== "unknown" && averageSeconds(topic.id));
  if (!tracked.length) return "Unknown";
  const risky = tracked.filter((topic) => averageSeconds(topic.id) > topic.targetSeconds + 20).length;
  if (!risky) return "Low";
  if (risky <= 2) return "Medium";
  return "High";
}

function getDayMode(date = todayISO()) {
  const day = parseDate(date).getDay();
  const isWeekend = day === 0 || day === 6;
  if (date < "2026-04-26") return "Pre-flight";
  if (date <= "2026-05-03") return "Full-time sprint";
  if (isWeekend) return "Weekend deep work";
  return "Norvestor evening";
}

function nextMock() {
  return state.mocks
    .filter((mock) => mock.status !== "completed" && mock.date >= todayISO())
    .sort((a, b) => a.date.localeCompare(b.date))[0] || state.mocks.at(-1);
}

function exactAssignment() {
  const mode = getDayMode();
  const due = dueCards();
  const ranked = rankedTopics().filter((topic) => topic.id !== "unknown");
  const top = ranked[0] || topics[0];
  const second = ranked[1] || ranked[0] || topics[1];

  const workNight = mode === "Norvestor evening";
  const weekend = mode === "Weekend deep work";
  const sprint = mode === "Full-time sprint";
  const reviewFirst = workNight && due.length > 0;
  const primary = reviewFirst ? getTopic(due[0].topic) : top;
  const module = ttpModules.find((item) => item.normalizedTopic === primary.id) || ttpModules[0];
  const count = workNight ? (due.length > 5 ? 10 : 15) : weekend ? 30 : sprint ? 35 : 12;
  const minutes = workNight ? 55 : weekend ? 135 : sprint ? 150 : 35;
  const cap = reviewCap();
  const mix = adaptiveMix(count);
  const modeText = reviewFirst ? "Redo due cards, then a small timed set" : primary.section === "Quant" ? "Timed after concept warm-up" : "Timed with reading routine";

  return {
    mode,
    topic: primary,
    secondary: second,
    module,
    count,
    minutes,
    difficulty: primary.priority <= 1 ? "Hard weighted mixed" : "Medium/hard mixed",
    setMode: modeText,
    targetAccuracy: primary.targetAccuracy,
    targetSeconds: primary.targetSeconds,
    reviewCap: cap,
    mix,
    reviewBlock: due.length
      ? `${Math.min(due.length, cap)} of ${due.length} due cards before new work`
      : "10-minute clean redo sweep",
    actions: [
      ["Open TTP", `${module.module}: ${module.label}.`],
      ["Do the set", `${count} questions, ${minutes} minutes max, ${modeText.toLowerCase()}.`],
      ["Bridge it back", "Screenshot or paste the result into Import; confirm the parsed batch once."]
    ]
  };
}

function currentBlock() {
  if (state.activeBlock) return state.activeBlock;
  return createBlockFromAssignment(false);
}

function createBlockFromAssignment(save = true) {
  const assignment = exactAssignment();
  const topic = assignment.topic;
  const blueprint = sectionBlueprint[topic.section] || sectionBlueprint.Unknown;
  const block = {
    id: uid("block"),
    kind: "GuidedBlock",
    date: todayISO(),
    status: "ready",
    createdAt: new Date().toISOString(),
    startedAt: null,
    elapsedSeconds: 0,
    source: "TTP",
    sourceLabel: `${assignment.module.module}: ${assignment.module.label}`,
    section: topic.section,
    topic: topic.id,
    questions: assignment.count,
    targetAccuracy: assignment.targetAccuracy,
    targetSeconds: assignment.targetSeconds,
    targetMinutes: Math.max(1, Math.round((assignment.count * assignment.targetSeconds) / 60)),
    difficulty: assignment.difficulty,
    setMode: assignment.setMode,
    reviewBlock: assignment.reviewBlock,
    reviewCap: assignment.reviewCap,
    mix: assignment.mix,
    blueprint
  };
  if (save) {
    state.activeBlock = block;
    saveState();
  }
  return block;
}

function blockElapsed(block = currentBlock()) {
  if (!block) return 0;
  if (block.status === "running" && block.startedAt) {
    return Math.max(0, Math.round((Date.now() - Number(block.startedAt)) / 1000));
  }
  return Number(block.elapsedSeconds || 0);
}

function formatDuration(seconds) {
  const value = Math.max(0, Number(seconds || 0));
  const minutes = Math.floor(value / 60);
  const remainder = value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function paceCheckpoints(block = currentBlock()) {
  const total = Number(block.questions || 1);
  const targetSeconds = Number(block.targetSeconds || 120);
  const raw = [0.25, 0.5, 0.75, 1].map((ratio) => ({
    question: Math.max(1, Math.round(total * ratio)),
    seconds: Math.round(total * ratio * targetSeconds)
  }));
  const seen = new Set();
  return raw.filter((item) => {
    const key = item.question;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function examProtocolFor(section) {
  const blueprint = sectionBlueprint[section] || sectionBlueprint.Unknown;
  const avg = blueprint.avgSeconds;
  return {
    blueprint,
    rules: [
      `${blueprint.questions} official questions in ${blueprint.minutes} minutes (${avg}s/q avg).`,
      `${blueprint.calculator}; train under the same constraint when possible.`,
      "Bookmark only high-uncertainty questions; the real exam allows three answer edits per section.",
      "Never leave blanks: unfinished questions are penalized."
    ]
  };
}

function inferTimingFlag(seconds, topic, correct) {
  if (correct && seconds <= topic.targetSeconds + 10) return "clean_correct";
  if (correct) return "uncertain_correct";
  if (seconds && seconds < Math.max(65, topic.targetSeconds * 0.55)) return "fast_wrong";
  if (seconds && seconds > topic.targetSeconds + 45) return "too_slow";
  return "unknown";
}

function inferFailure(parsed) {
  const topic = getTopic(parsed.topic);
  const wrong = Number(parsed.wrong || 0);
  const avgSeconds = Number(parsed.avgSeconds || 0);
  const textCause = normalizeFailureCause(`${parsed.sourceLabel} ${parsed.rawText || ""}`);
  if (textCause !== "unknown") return { failureCause: textCause, confidence: 0.62 };
  if (topic.section === "DI" && wrong > 0 && avgSeconds && avgSeconds < topic.targetSeconds * 0.75) {
    return { failureCause: topic.id === "graphs-tables" ? "rushed_read" : "data_reading", confidence: 0.74 };
  }
  if (topic.id === "graphs-tables") return { failureCause: "data_reading", confidence: 0.66 };
  if (topic.id === "alg-word" && avgSeconds > topic.targetSeconds + 30) return { failureCause: "translation_setup", confidence: 0.69 };
  if (topic.id === "alg-word") return { failureCause: "translation_setup", confidence: 0.58 };
  if (topic.section === "Quant" && avgSeconds > topic.targetSeconds + 45) return { failureCause: "overinvestment", confidence: 0.58 };
  if (topic.id === "value-order-factors") return { failureCause: "concept_gap", confidence: 0.55 };
  return { failureCause: "unknown", confidence: 0.25 };
}

function parseImportText(rawText) {
  const raw = rawText || "";
  const text = normalizeText(raw);
  const topicGuess = normalizeTopic(raw);
  const source = text.includes("gmat club") ? "GMAT Club" : text.includes("official") || text.includes("mba") ? "mba.com Official" : "TTP";
  const difficulty = text.includes("hard") ? "Hard" : text.includes("medium") ? "Medium" : text.includes("easy") ? "Easy" : "Mixed";
  const questions = extractNumber(text, [
    /(\d+)\s*(?:questions|question|qs|q\b)/,
    /(?:total|attempted)\s*(?:questions)?\s*(\d+)/
  ], 15);
  const correct = extractNumber(text, [
    /(\d+)\s*(?:correct|right)/,
    /(?:score|result)\s*(\d+)\s*\/\s*(\d+)/,
    /(\d+)\s*\/\s*(\d+)/
  ], Math.max(0, questions - extractNumber(text, [/(\d+)\s*(?:wrong|incorrect|missed)/], Math.round(questions * 0.3))));
  const wrong = Math.max(0, extractNumber(text, [/(\d+)\s*(?:wrong|incorrect|missed)/], questions - correct));
  const minutes = extractNumber(text, [
    /(\d+)\s*(?:minutes|minute|min\b|mins)/,
    /(?:time|duration)\s*(\d+)(?::|\s)(\d{1,2})/
  ], Math.max(1, Math.round((questions * getTopic(topicGuess.topic).targetSeconds) / 60)));
  const avgSeconds = questions ? Math.round((minutes * 60) / questions) : getTopic(topicGuess.topic).targetSeconds;
  const sourceLabel = guessSourceLabel(raw, topicGuess.topic);
  const inferred = inferFailure({ topic: topicGuess.topic, wrong, avgSeconds, sourceLabel, rawText: raw });
  const confidence = inferred.failureCause === "unknown"
    ? Math.min(topicGuess.confidence, 0.42)
    : Math.min(0.95, (topicGuess.confidence * 0.45 + inferred.confidence * 0.55) - (topicGuess.topic === "unknown" ? 0.2 : 0));
  return {
    date: todayISO(),
    source,
    sourceLabel,
    topic: topicGuess.topic,
    setType: text.includes("chapter") ? "Chapter test" : text.includes("diagnostic") ? "Diagnostic" : "Custom test",
    difficulty,
    questions,
    correct: Math.min(correct, questions),
    wrong: Math.max(0, wrong),
    uncertain: 0,
    minutes,
    avgSeconds,
    failureCause: inferred.failureCause,
    confidence: Math.max(0.05, confidence),
    rawText: raw
  };
}

function extractNumber(text, patterns, fallback) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      if (match.length > 2 && pattern.source.includes("\\/")) return Number(match[1]);
      return Number(match[1]);
    }
  }
  return fallback;
}

function guessSourceLabel(raw, topicId) {
  const lines = raw.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const useful = lines.find((line) => normalizeTopic(line).topic !== "unknown");
  return useful || `${getTopic(topicId).ttpModule}: ${getTopic(topicId).assignment}`;
}

function duplicateFor(parsed) {
  return state.importBatches.find((batch) =>
    batch.date === parsed.date &&
    batch.source === parsed.source &&
    batch.topic === parsed.topic &&
    Number(batch.questions) === Number(parsed.questions) &&
    Number(batch.correct) === Number(parsed.correct) &&
    Number(batch.minutes) === Number(parsed.minutes)
  );
}

function renderTabs() {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab-button").forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });
      document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");
      byId(button.dataset.tab).classList.add("active");
      if (window.location.hash !== `#tab-${button.dataset.tab}`) {
        history.replaceState(null, "", `#tab-${button.dataset.tab}`);
      }
    });
  });
}

function openTab(tabId) {
  const button = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
  const panel = byId(tabId);
  if (!button || !panel) return;
  document.querySelectorAll(".tab-button").forEach((item) => {
    item.classList.remove("active");
    item.setAttribute("aria-pressed", "false");
  });
  document.querySelectorAll(".tab-panel").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  button.setAttribute("aria-pressed", "true");
  panel.classList.add("active");
  if (window.location.hash !== `#tab-${tabId}`) {
    history.replaceState(null, "", `#tab-${tabId}`);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setupQuickActions() {
  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-jump]");
    if (!target) return;
    openTab(target.dataset.jump);
  });
}

function setupGlobalActions() {
  document.addEventListener("click", (event) => {
    const startBlock = event.target.closest("[data-start-block]");
    if (startBlock) {
      createBlockFromAssignment(true);
      renderAll();
      openTab("coach");
      return;
    }

    const blockAction = event.target.closest("[data-block-action]");
    if (blockAction) {
      handleBlockAction(blockAction.dataset.blockAction);
      return;
    }

    const deleteImport = event.target.closest("[data-delete-import]");
    if (deleteImport) {
      deleteImportBatch(deleteImport.dataset.deleteImport);
      return;
    }

    const nav = event.target.closest("[data-review-nav]");
    if (nav) {
      moveReview(Number(nav.dataset.reviewNav));
      return;
    }

    const reveal = event.target.closest("[data-review-reveal]");
    if (reveal) {
      activeReviewRevealed = true;
      renderReview();
      return;
    }

    const deleteCard = event.target.closest("[data-delete-card]");
    if (deleteCard) {
      deleteMistakeCard(deleteCard.dataset.deleteCard);
    }
  });
}

function handleBlockAction(action) {
  const block = state.activeBlock || createBlockFromAssignment(true);
  if (action === "start") {
    const elapsed = blockElapsed(block);
    block.startedAt = Date.now() - elapsed * 1000;
    block.status = "running";
  }
  if (action === "pause") {
    block.elapsedSeconds = blockElapsed(block);
    block.startedAt = null;
    block.status = "paused";
  }
  if (action === "reset") {
    block.elapsedSeconds = 0;
    block.startedAt = null;
    block.status = "ready";
  }
  saveState();
  renderCoach();
  updateBlockTimer();
}

function updateBlockTimer() {
  const timer = byId("block-timer");
  if (!timer) return;
  timer.textContent = formatDuration(blockElapsed(currentBlock()));
}

function setupBlockTicker() {
  if (blockTicker) return;
  blockTicker = setInterval(() => {
    if (state.activeBlock && state.activeBlock.status === "running") updateBlockTimer();
  }, 1000);
}

function renderDashboard() {
  const today = todayISO();
  const assignment = exactAssignment();
  const band = estimatedScoreBand();
  byId("today-date").textContent = formatDate(today);
  byId("today-mode").textContent = assignment.mode;
  byId("assignment-hero").innerHTML = `
    <span class="assignment-source">TTP next</span>
    <strong>${escapeHtml(assignment.module.module)}</strong>
    <span>${escapeHtml(assignment.module.label)}</span>
  `;
  byId("assignment-spec").innerHTML = [
    ["Set", `${assignment.count} questions`],
    ["Target", `${assignment.targetAccuracy}% / ${assignment.targetSeconds}s`],
    ["Mode", assignment.setMode],
    ["Review", assignment.reviewBlock]
  ].map(([key, value]) => `<div><dt>${key}</dt><dd>${escapeHtml(value)}</dd></div>`).join("");
  byId("today-actions").innerHTML = [
    ["Open TTP", `${assignment.module.module}: ${assignment.module.label}.`],
    ["Do the set", `${assignment.count} questions. Stop when the block is done.`],
    ["Debrief", "Save score and cause; repairs are created automatically."]
  ]
    .map(([title, body]) => `<li><strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span></li>`)
    .join("");
  const mock = nextMock();
  byId("routine-strip").innerHTML = [
    latestBottleneck(),
    `Next mock: ${formatDate(mock.date)}`,
    verbalNeedsWork() ? "Verbal needs attention" : "Verbal maintenance only"
  ]
    .map((item) => `<span class="pill">${item}</span>`)
    .join("");

  const metrics = [
    {
      label: "Today",
      value: `${assignment.count}q`,
      note: assignment.topic.name
    },
    {
      label: "Fix due",
      value: reviewDebtLabel(),
      note: `${dueCards().length} due cards`
    },
    {
      label: "Score band",
      value: `${band.low}-${band.high}`,
      note: `Target ${state.profile.targetTotal}`
    }
  ];
  byId("metric-grid").innerHTML = metrics.map(renderMetric).join("");
  renderMemoryCoach(assignment);
  renderLearningEngine(assignment);
  renderTopicTable();
  renderReadiness();
  renderNextMock();
}

function renderMetric(metric) {
  return `
    <article class="metric-card">
      <span class="metric-label">${escapeHtml(metric.label)}</span>
      <strong class="metric-value">${escapeHtml(metric.value)}</strong>
      <span class="metric-note">${escapeHtml(metric.note)}</span>
    </article>
  `;
}

function renderOxfordInspiration() {
  const dayIndex = Math.abs(dateDiff("2026-01-01", todayISO())) % oxfordMuses.length;
  const muse = oxfordMuses[dayIndex];
  const image = byId("oxford-ribbon-image");
  if (image) {
    image.src = muse.image;
    image.alt = muse.title;
    byId("oxford-ribbon-kicker").textContent = muse.kicker;
    byId("oxford-ribbon-title").textContent = muse.title;
    byId("oxford-ribbon-quote").textContent = muse.quote;
  }

  const gallery = byId("oxford-gallery");
  if (!gallery) return;
  const cards = [0, 1, 2, 3].map((offset) => oxfordMuses[(dayIndex + offset) % oxfordMuses.length]);
  gallery.innerHTML = cards.map((item) => `
    <article class="oxford-card">
      <img src="${item.image}" alt="${escapeHtml(item.title)}">
      <div>
        <span>${escapeHtml(item.kicker)}</span>
        <strong>${escapeHtml(item.title)}</strong>
        <q>${escapeHtml(item.quote)}</q>
        <em>${escapeHtml(item.person)}</em>
      </div>
    </article>
  `).join("");
}

function renderMemoryCoach(assignment) {
  const target = byId("memory-coach");
  if (!target) return;
  const due = dueCards();
  const riskItems = memoryRiskCards();
  const reviewCap = assignment.reviewCap || 6;
  const rescueCount = Math.min(reviewCap, Math.max(due.length, riskItems.length));
  const oldest = riskItems.reduce((max, item) => Math.max(max, dateDiff(cardLastTouch(item.card), todayISO())), 0);
  const topTopics = riskItems
    .slice(0, 4)
    .reduce((map, item) => {
      const key = item.card.topic;
      map.set(key, (map.get(key) || 0) + 1);
      return map;
    }, new Map());
  const topTopic = [...topTopics.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  const topLabel = topTopic ? topicName(topTopic) : assignment.topic.name;
  const atRisk = riskItems.filter((item) => item.recall < 0.86 || item.card.nextReview <= todayISO()).length;
  const minutes = Math.max(0, Math.min(35, rescueCount * 2));
  const tone = due.length ? "Rescue due cards first" : atRisk ? "Protect fading cards" : "Memory is calm";

  target.innerHTML = `
    <div class="memory-hero">
      <span>${escapeHtml(tone)}</span>
      <strong>${rescueCount}</strong>
      <em>cards before new volume</em>
    </div>
    <div class="memory-facts">
      <div><span>At risk</span><strong>${atRisk}</strong></div>
      <div><span>Oldest gap</span><strong>${oldest}d</strong></div>
      <div><span>Time box</span><strong>${minutes}m</strong></div>
    </div>
    <p>${escapeHtml(topLabel)} is the memory lane most worth protecting today.</p>
  `;
}

function renderLearningEngine(assignment) {
  const due = dueCards();
  const leeches = leechCards();
  const mix = assignment.mix.length ? assignment.mix : adaptiveMix(assignment.count);
  const nextSteps = [
    {
      label: "Repair",
      value: due.length ? `${Math.min(due.length, assignment.reviewCap)} due cards` : "No overdue cards",
      state: due.length ? "hot" : "calm"
    },
    {
      label: "Warm-up",
      value: `${assignment.topic.ttpModule}: ${assignment.topic.assignment}`,
      state: "active"
    },
    {
      label: "Interleave",
      value: mix.map((item) => `${item.count} ${item.topic.name}`).join(" / "),
      state: "active"
    },
    {
      label: "Close loop",
      value: "Import result, then repair every wrong or uncertain item",
      state: "calm"
    }
  ];
  byId("next-step-list").innerHTML = nextSteps.map((step) => `
    <div class="loop-item ${step.state}">
      <span>${escapeHtml(step.label)}</span>
      <strong>${escapeHtml(step.value)}</strong>
    </div>
  `).join("");

  byId("adaptive-mix").innerHTML = mix.map((item) => `
    <div class="mix-item">
      <strong>${escapeHtml(item.topic.name)}</strong>
      <span>${item.count} questions / ${escapeHtml(item.mode)} / ${escapeHtml(item.target)}</span>
      <div class="risk-bar risk-${riskSeverity(item.topic.risk)}"><span style="width:${Math.min(100, item.topic.risk)}%"></span></div>
    </div>
  `).join("");

  const band = estimatedScoreBand();
  byId("momentum-card").innerHTML = `
    <div class="momentum-number">${studyStreak()}<span>day streak</span></div>
    <div class="momentum-lines">
      <div><strong>${band.low}-${band.high}</strong><span>current score band</span></div>
      <div><strong>${Math.max(0, dateDiff(todayISO(), state.profile.targetExamDate))}</strong><span>days to target exam</span></div>
      <div><strong>${leeches.length}</strong><span>repeat offenders</span></div>
      <div><strong>${reviewDebtLabel()}</strong><span>review debt</span></div>
    </div>
  `;
}

function renderCoach() {
  if (!byId("coach-focus")) return;
  const block = currentBlock();
  const topic = getTopic(block.topic);
  const protocol = examProtocolFor(block.section);
  const elapsed = blockElapsed(block);
  const targetTotal = Math.max(1, Number(block.questions || 1) * Number(block.targetSeconds || 120));
  const paceDelta = elapsed - targetTotal;
  const paceText = elapsed === 0
    ? "Ready"
    : paceDelta <= -30
      ? `${formatDuration(Math.abs(paceDelta))} ahead`
      : paceDelta <= 30
        ? "On pace"
        : `${formatDuration(paceDelta)} behind`;

  byId("coach-focus").innerHTML = `
    <div class="coach-hero">
      <span>${escapeHtml(block.source)}</span>
      <strong>${escapeHtml(topic.ttpModule)}</strong>
      <p>${escapeHtml(topic.assignment)}</p>
    </div>
    <dl class="coach-stats">
      <div><dt>Set</dt><dd>${block.questions} questions</dd></div>
      <div><dt>Target</dt><dd>${block.targetAccuracy}% / ${block.targetSeconds}s</dd></div>
      <div><dt>Pace</dt><dd>${escapeHtml(paceText)}</dd></div>
    </dl>
    <div class="coach-warning">${escapeHtml(block.setMode)} / ${escapeHtml(block.reviewBlock)}</div>
  `;

  byId("block-timer").textContent = formatDuration(elapsed);
  byId("pace-ladder").innerHTML = paceCheckpoints(block).map((item) => {
    const reached = elapsed >= item.seconds;
    return `
      <div class="${reached ? "reached" : ""}">
        <span>Q${item.question}</span>
        <strong>${formatDuration(item.seconds)}</strong>
      </div>
    `;
  }).join("");

  byId("exam-protocol").innerHTML = `
    <div class="protocol-topline">
      <strong>${escapeHtml(protocol.blueprint.label)}</strong>
      <span>${protocol.blueprint.questions} q / ${protocol.blueprint.minutes} min</span>
    </div>
    <ul>${protocol.rules.map((rule) => `<li>${escapeHtml(rule)}</li>`).join("")}</ul>
  `;

  const form = byId("guided-debrief-form");
  if (form) {
    const targetCorrect = Math.round((Number(block.questions) * Number(block.targetAccuracy || 80)) / 100);
    form.questions.value = block.questions;
    form.minutes.value = Math.max(1, Math.round((elapsed || block.questions * block.targetSeconds) / 60));
    form.correct.value = Math.min(Number(form.questions.value), Math.max(0, targetCorrect));
    setSelectIfOption(form.difficulty, block.difficulty.includes("Hard") ? "Hard" : "Mixed");
  }

  const causeSelect = byId("debrief-cause-select");
  if (causeSelect) {
    causeSelect.innerHTML = failureCauses
      .filter((cause) => cause.id !== "unknown")
      .map((cause) => `<option value="${cause.id}">${escapeHtml(cause.label)}</option>`)
      .join("");
  }
}

function latestBottleneck() {
  const top = rankedTopics()[0];
  const accuracy = topicAccuracy(top.id);
  const seconds = averageSeconds(top.id);
  if (dueCards().length > 0) return `${dueCards().length} due mistake cards`;
  if (accuracy != null && accuracy < top.targetAccuracy) return `${top.name}: accuracy gap`;
  if (seconds != null && seconds > top.targetSeconds) return `${top.name}: pacing gap`;
  return `${top.name}: next score lever`;
}

function renderTopicTable() {
  byId("topic-table").innerHTML = rankedTopics()
    .filter((topic) => topic.risk > 0)
    .map((topic) => {
      const accuracy = topicAccuracy(topic.id);
      const seconds = averageSeconds(topic.id);
      const due = topicDueCount(topic.id);
      const capped = Math.min(100, Math.round(topic.risk));
      const severity = riskSeverity(topic.risk);
      const mastery = topicMastery(topic.id);
      const accLabel = accuracy == null ? "No local reps" : `${accuracy}% recent`;
      const secLabel = seconds == null ? "No pace data" : `${seconds}s/q`;
      return `
        <div class="topic-row">
          <div>
            <div class="topic-name">${escapeHtml(topic.name)}</div>
            <div class="topic-meta">${escapeHtml(topic.ttpModule)} / P${topic.priority} / ESR ${topic.baseline}th pct</div>
          </div>
          <div class="mastery-pill ${mastery.className}">${escapeHtml(mastery.label)}</div>
          <div class="topic-score">${accLabel}</div>
          <div class="topic-score">${secLabel}</div>
          <div class="topic-score">${due} due</div>
          <div class="risk-bar risk-${severity}" aria-label="${riskLabel(topic.risk)} priority ${capped}">
            <span style="width: ${capped}%"></span>
          </div>
          <div class="topic-action"><strong>${riskLabel(topic.risk)}</strong> / ${escapeHtml(topic.assignment)}</div>
        </div>
      `;
    })
    .join("");
}

function renderReadiness() {
  const rows = [
    ["Quant", sectionReadiness("Quant"), "fill-coral"],
    ["DI", sectionReadiness("DI"), "fill-green"],
    ["Verbal", verbalNeedsWork() ? sectionReadiness("Verbal") : 95, "fill-steel"]
  ];
  byId("readiness-chart").innerHTML = rows.map(([label, value, className]) => `
    <div class="bar-line">
      <div class="bar-label"><span>${label}</span><span>${value}%</span></div>
      <div class="bar-track"><div class="bar-fill ${className}" style="width:${value}%"></div></div>
    </div>
  `).join("");
}

function renderNextMock() {
  const mock = nextMock();
  const days = Math.max(0, dateDiff(todayISO(), mock.date));
  byId("next-mock").innerHTML = `
    <div class="mock-callout">
      <span class="mock-index">${escapeHtml(mock.label)}</span>
      <div>
        <h3>${escapeHtml(mock.source)} in ${days} day${days === 1 ? "" : "s"}</h3>
        <p>${formatDate(mock.date)} / ${escapeHtml(mock.purpose)}</p>
      </div>
    </div>
    <p class="muted-copy">Mock work is calibration. TTP and mistake repair drive the daily queue.</p>
  `;
}

function populateForms() {
  document.querySelectorAll('input[type="date"]').forEach((input) => {
    if (!input.value) input.value = todayISO();
  });
  document.querySelectorAll('select[name="section"]').forEach((select) => {
    select.innerHTML = sectionOptions.map((section) => `<option>${section}</option>`).join("");
  });
  document.querySelectorAll('select[name="topic"]').forEach((select) => {
    const current = select.value;
    select.innerHTML = topics.map((topic) => `<option value="${topic.id}">${topic.section}: ${topic.name}</option>`).join("");
    if (current) select.value = current;
  });
  document.querySelectorAll('select[name="failureCause"]').forEach((select) => {
    const current = select.value;
    select.innerHTML = failureCauses.map((cause) => `<option value="${cause.id}">${cause.label}</option>`).join("");
    if (current) select.value = current;
  });
  document.querySelectorAll('select[name="trainingState"]').forEach((select) => {
    const current = select.value;
    select.innerHTML = trainingStates.map((item) => `<option value="${item.id}">${item.label}</option>`).join("");
    if (current) select.value = current;
  });
}

function readForm(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function setupForms() {
  byId("session-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = readForm(event.currentTarget);
    const questions = Number(data.questions);
    const correct = Math.min(Number(data.correct), questions);
    const minutes = Number(data.minutes);
    const session = {
      id: uid("session"),
      kind: "PracticeSession",
      date: data.date,
      source: data.source,
      sourceLabel: topicName(data.topic),
      section: data.section,
      topic: data.topic,
      questions,
      correct,
      wrong: Math.max(0, questions - correct),
      uncertain: Number(data.uncertain || 0),
      minutes,
      avgSeconds: questions ? Math.round((minutes * 60) / questions) : 0,
      difficulty: data.difficulty,
      setType: data.focus,
      notes: data.notes.trim()
    };
    state.sessions.push(session);
    saveState();
    event.currentTarget.reset();
    populateForms();
    renderAll();
  });

  byId("error-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = readForm(event.currentTarget);
    const topic = getTopic(data.topic);
    state.mistakeCards.push({
      id: uid("card"),
      kind: "MistakeCard",
      date: data.date,
      source: data.source || "Custom",
      sourceLabel: data.reference || topic.name,
      section: data.section,
      topic: data.topic,
      failureCause: data.failureCause,
      trainingState: data.trainingState,
      timingFlag: inferTimingFlag(Number(data.seconds), topic, false),
      confidence: 0.92,
      seconds: Number(data.seconds),
      reference: data.reference || "",
      lesson: (data.lesson.trim() || data.lessonPreset || "").trim(),
      nextReview: addDays(data.date, 1),
      intervalIndex: 0,
      attempts: 0,
      misses: 0
    });
    saveState();
    event.currentTarget.reset();
    populateForms();
    renderAll();
  });

  byId("guided-debrief-form").addEventListener("submit", (event) => {
    event.preventDefault();
    saveGuidedDebrief(readForm(event.currentTarget));
  });

  byId("seed-error").addEventListener("click", () => {
    state.mistakeCards.push({
      id: uid("card"),
      kind: "MistakeCard",
      date: todayISO(),
      source: "Sample",
      sourceLabel: "TTP Number Properties",
      section: "Quant",
      topic: "value-order-factors",
      failureCause: "concept_gap",
      trainingState: "due",
      timingFlag: "too_slow",
      confidence: 0.75,
      seconds: 210,
      reference: "Divisibility / inequalities",
      lesson: "List constraints before substituting numbers. Check sign changes before comparing inequalities.",
      nextReview: todayISO(),
      intervalIndex: 0,
      attempts: 0,
      misses: 0
    });
    saveState();
    renderAll();
  });

  byId("reset-data").addEventListener("click", () => {
    if (!confirm("Reset local GMAT optimizer data to the seeded V4 coach plan?")) return;
    state = structuredClone(defaultState);
    saveState();
    populateForms();
    renderAll();
  });

  setupSmartDefaults();
}

function referencePresetFor(topicId) {
  return {
    "alg-word": "TTP Algebra module",
    "value-order-factors": "TTP Number Properties module",
    "rates-ratios-percent": "TTP Rates / Ratios / Percent module",
    "graphs-tables": "TTP Graphs and Tables set",
    "multi-source": "TTP Multi-Source Reasoning set",
    "two-part": "TTP Two-Part Analysis set",
    "data-sufficiency": "TTP Data Sufficiency set"
  }[topicId] || "Official mock review";
}

function lessonPresetFor(topicId, failureCause) {
  if (topicId === "graphs-tables" || failureCause === "data_reading") return "Check units, axes, trend, and outliers before answering.";
  if (failureCause === "translation_setup") return "Name variables before manipulating equations.";
  if (failureCause === "execution_algebra") return "Write constraints before substituting numbers.";
  if (failureCause === "overinvestment") return "Cap the first approach; guess cleanly if no path appears.";
  if (failureCause === "rushed_read") return "Slow down: this was a rushed read, not a hard question.";
  if (failureCause === "concept_gap") return "Redo the concept example before the next timed set.";
  return "Read the exact question stem before looking at answers.";
}

function setSelectIfOption(select, value) {
  if (!select || !value) return;
  const option = [...select.options].find((item) => item.value === value || item.textContent === value);
  if (option) select.value = option.value;
}

function setupSmartDefaults() {
  const errorForm = byId("error-form");
  const importForm = byId("import-review-form");
  if (!errorForm || !importForm) return;

  const syncErrorDefaults = () => {
    const topic = getTopic(errorForm.topic.value);
    errorForm.section.value = topic.section;
    setSelectIfOption(errorForm.reference, referencePresetFor(topic.id));
    setSelectIfOption(errorForm.lessonPreset, lessonPresetFor(topic.id, errorForm.failureCause.value));
  };

  errorForm.topic.addEventListener("change", syncErrorDefaults);
  errorForm.failureCause.addEventListener("change", syncErrorDefaults);
  syncErrorDefaults();

  const syncImportFix = () => {
    importForm.fixRule.value = defaultFixRule(importForm.topic.value, importForm.failureCause.value);
  };
  importForm.topic.addEventListener("change", syncImportFix);
  importForm.failureCause.addEventListener("change", syncImportFix);
}

function saveGuidedDebrief(data) {
  const block = state.activeBlock || createBlockFromAssignment(true);
  const topic = getTopic(block.topic);
  const questions = Math.max(1, Number(data.questions || block.questions));
  const correct = Math.min(questions, Math.max(0, Number(data.correct || 0)));
  const wrong = Math.max(0, questions - correct);
  const uncertain = Math.max(0, Number(data.uncertain || 0));
  const minutes = Math.max(1, Number(data.minutes || Math.round(blockElapsed(block) / 60) || block.targetMinutes));
  const avgSeconds = Math.round((minutes * 60) / questions);
  const failureCause = data.failureCause || "unknown";
  const lesson = data.fixRulePreset || defaultFixRule(topic.id, failureCause);
  const blockId = block.id || uid("block");
  const completedBlock = {
    ...block,
    id: blockId,
    status: "completed",
    completedAt: new Date().toISOString(),
    elapsedSeconds: blockElapsed(block),
    questions,
    correct,
    wrong,
    uncertain,
    minutes,
    avgSeconds,
    failureCause,
    quality: data.quality || "clean"
  };

  state.guidedBlocks.push(completedBlock);
  state.sessions.push({
    id: uid("session"),
    kind: "PracticeSession",
    guidedBlockId: blockId,
    date: block.date || todayISO(),
    source: block.source || "TTP",
    sourceLabel: block.sourceLabel || topic.name,
    section: topic.section,
    topic: topic.id,
    questions,
    correct,
    wrong,
    uncertain,
    minutes,
    avgSeconds,
    difficulty: data.difficulty || block.difficulty,
    setType: "Guided coach block",
    notes: `Coach debrief: ${data.quality || "clean"}`
  });

  const reviewCount = Math.min(40, wrong + uncertain);
  for (let index = 0; index < reviewCount; index += 1) {
    const incorrect = index < wrong;
    const timingFlag = inferTimingFlag(avgSeconds, topic, !incorrect);
    state.questionAttempts.push({
      id: uid("attempt"),
      kind: "QuestionAttempt",
      guidedBlockId: blockId,
      date: block.date || todayISO(),
      source: block.source || "TTP",
      sourceLabel: block.sourceLabel || topic.name,
      topic: topic.id,
      section: topic.section,
      correct: !incorrect,
      uncertain: !incorrect,
      seconds: avgSeconds,
      timingFlag,
      failureCause,
      confidence: 0.88
    });
    state.mistakeCards.push({
      id: uid("card"),
      kind: "MistakeCard",
      guidedBlockId: blockId,
      date: block.date || todayISO(),
      source: block.source || "TTP",
      sourceLabel: block.sourceLabel || topic.name,
      section: topic.section,
      topic: topic.id,
      failureCause,
      trainingState: "due",
      timingFlag,
      confidence: 0.88,
      seconds: avgSeconds,
      reference: `${block.sourceLabel || topic.name} coach card #${index + 1}`,
      lesson,
      nextReview: addDays(block.date || todayISO(), 1),
      intervalIndex: 0,
      attempts: 0,
      misses: 0,
      ease: 2.5
    });
  }

  state.activeBlock = null;
  saveState();
  setStatus("debrief-status", `Saved: ${correct}/${questions}, ${reviewCount} repair card${reviewCount === 1 ? "" : "s"}.`);
  renderAll();
  if (reviewCount) openTab("review");
}

function setupImport() {
  const dropZone = byId("drop-zone");
  const input = byId("screenshot-input");
  const preview = byId("screenshot-preview");

  dropZone.addEventListener("click", () => input.click());
  input.addEventListener("change", () => handleScreenshot(input.files[0]));
  dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("dragging");
  });
  dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragging"));
  dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragging");
    handleScreenshot(event.dataTransfer.files[0]);
  });
  document.addEventListener("paste", (event) => {
    const imageItem = [...event.clipboardData.items].find((item) => item.type.startsWith("image/"));
    if (imageItem) handleScreenshot(imageItem.getAsFile());
  });

  function handleScreenshot(file) {
    if (!file) return;
    selectedScreenshot = file;
    preview.src = URL.createObjectURL(file);
    preview.classList.add("visible");
    setStatus("ocr-status", "Screenshot ready. Run OCR or paste text manually.");
  }

  byId("run-ocr").addEventListener("click", async () => {
    if (!selectedScreenshot) {
      setStatus("ocr-status", "Choose a screenshot first.");
      return;
    }
    const engineReady = await ensureOcrEngine();
    if (!engineReady) {
      setStatus("ocr-status", "OCR engine unavailable. Paste the visible result text instead.");
      return;
    }
    setStatus("ocr-status", "Running local OCR in the browser...");
    try {
      const result = await window.Tesseract.recognize(selectedScreenshot, "eng", {
        logger: (message) => {
          if (message.status) setStatus("ocr-status", `${message.status} ${Math.round((message.progress || 0) * 100)}%`);
        }
      });
      byId("import-text").value = result.data.text.trim();
      parseAndRenderImport(result.data.text);
      setStatus("ocr-status", "OCR complete. Confirm the parsed batch before saving.");
    } catch (error) {
      setStatus("ocr-status", `OCR failed: ${error.message}. Paste text instead.`);
    }
  });

  byId("parse-import").addEventListener("click", () => parseAndRenderImport(byId("import-text").value));
  byId("prefill-today").addEventListener("click", () => prefillTodayImport());
  byId("clear-import").addEventListener("click", () => {
    selectedScreenshot = null;
    preview.removeAttribute("src");
    preview.classList.remove("visible");
    byId("import-text").value = "";
    lastParsedImport = null;
    fillImportForm(parseImportText(""));
    setStatus("ocr-status", "Cleared.");
  });

  byId("import-review-form").addEventListener("submit", (event) => {
    event.preventDefault();
    saveImportBatch(readForm(event.currentTarget));
  });
}

function ensureOcrEngine() {
  if (window.Tesseract) return Promise.resolve(true);
  if (window.__ocrLoading) return window.__ocrLoading;
  setStatus("ocr-status", "Loading OCR engine...");
  window.__ocrLoading = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
    script.async = true;
    script.onload = () => resolve(Boolean(window.Tesseract));
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
  return window.__ocrLoading;
}

function parseAndRenderImport(text) {
  lastParsedImport = parseImportText(text);
  fillImportForm(lastParsedImport);
}

function prefillTodayImport() {
  const assignment = exactAssignment();
  const minutes = Math.max(1, Math.round((assignment.count * assignment.targetSeconds) / 60));
  const parsed = {
    date: todayISO(),
    source: "TTP",
    sourceLabel: `${assignment.module.module}: ${assignment.module.label}`,
    topic: assignment.topic.id,
    setType: "Custom test",
    difficulty: assignment.difficulty.includes("Hard") ? "Hard" : "Mixed",
    questions: assignment.count,
    correct: Math.round(assignment.count * assignment.targetAccuracy / 100),
    wrong: Math.max(0, assignment.count - Math.round(assignment.count * assignment.targetAccuracy / 100)),
    uncertain: 0,
    minutes,
    avgSeconds: assignment.targetSeconds,
    failureCause: assignment.topic.section === "DI" ? "data_reading" : "concept_gap",
    confidence: 0.88,
    rawText: "Prefilled from today's assignment"
  };
  lastParsedImport = parsed;
  fillImportForm(parsed);
  byId("import-text").value = `${parsed.sourceLabel}\n${parsed.difficulty}\n${parsed.questions} questions\n${parsed.correct}/${parsed.questions}\n${parsed.minutes} minutes`;
  setStatus("ocr-status", "Today's assignment is prefilled. Adjust correct/wrong after the set.");
}

function fillImportForm(parsed) {
  const form = byId("import-review-form");
  const data = parsed || parseImportText("");
  form.date.value = data.date;
  form.source.value = data.source;
  form.setType.value = data.setType;
  form.sourceLabel.value = data.sourceLabel;
  form.topic.value = data.topic;
  form.difficulty.value = data.difficulty;
  form.questions.value = data.questions;
  form.correct.value = data.correct;
  form.minutes.value = data.minutes;
  form.wrong.value = data.wrong;
  form.uncertain.value = data.uncertain;
  form.avgSeconds.value = data.avgSeconds;
  form.failureCause.value = data.failureCause;
  form.fixRule.value = defaultFixRule(data.topic, data.failureCause);
  const confidence = Math.round((data.confidence || 0) * 100);
  const confidenceLabel = confidence >= 75 ? "High confidence" : confidence >= 45 ? "Confirm fields" : "Needs classification";
  byId("import-confidence").textContent = `${confidenceLabel} / ${confidence}%`;
  byId("import-confidence").className = `confidence-pill ${confidence >= 75 ? "high" : confidence >= 45 ? "medium" : "low"}`;
  const duplicate = duplicateFor(data);
  byId("duplicate-warning").textContent = duplicate ? `Possible duplicate: imported on ${formatDate(duplicate.savedAt || duplicate.date)}.` : "";
}

function defaultFixRule(topicId, failureCause) {
  if (topicId === "graphs-tables") return "Before answering: title and axes, units, trend direction, outliers.";
  if (failureCause === "translation_setup") return "Name variables and write the relationship before manipulating equations.";
  if (failureCause === "overinvestment") return "Cap the first approach. If no path appears, switch or guess cleanly.";
  if (failureCause === "concept_gap") return "Redo the concept example before the next timed set.";
  if (failureCause === "rushed_read") return "Slow the first read; underline the actual ask before choosing.";
  return "";
}

function saveImportBatch(data) {
  const questions = Number(data.questions);
  const correct = Math.min(Number(data.correct), questions);
  const minutes = Number(data.minutes);
  const wrong = Math.max(0, Number(data.wrong || questions - correct));
  const uncertain = Number(data.uncertain || 0);
  const topic = getTopic(data.topic);
  const batch = {
    id: uid("import"),
    kind: "ImportBatch",
    date: data.date,
    savedAt: todayISO(),
    source: data.source,
    sourceLabel: data.sourceLabel.trim() || topic.name,
    topic: data.topic,
    section: topic.section,
    setType: data.setType,
    difficulty: data.difficulty,
    questions,
    correct,
    wrong,
    uncertain,
    minutes,
    avgSeconds: Number(data.avgSeconds),
    failureCause: data.failureCause,
    confidence: lastParsedImport ? lastParsedImport.confidence : 0.6,
    rawText: lastParsedImport ? lastParsedImport.rawText : byId("import-text").value
  };
  if (duplicateFor(batch) && !confirm("This looks like a duplicate import. Save anyway?")) return;

  state.importBatches.push(batch);
  state.sessions.push({
    id: uid("session"),
    kind: "PracticeSession",
    importBatchId: batch.id,
    date: batch.date,
    source: batch.source,
    sourceLabel: batch.sourceLabel,
    section: batch.section,
    topic: batch.topic,
    questions: batch.questions,
    correct: batch.correct,
    wrong: batch.wrong,
    uncertain: batch.uncertain,
    minutes: batch.minutes,
    avgSeconds: batch.avgSeconds,
    difficulty: batch.difficulty,
    setType: batch.setType,
    notes: "Imported batch"
  });

  const reviewCount = Math.min(40, batch.wrong + batch.uncertain);
  for (let index = 0; index < reviewCount; index += 1) {
    const incorrect = index < batch.wrong;
    const seconds = batch.avgSeconds;
    const timingFlag = inferTimingFlag(seconds, topic, !incorrect);
    state.questionAttempts.push({
      id: uid("attempt"),
      kind: "QuestionAttempt",
      importBatchId: batch.id,
      date: batch.date,
      source: batch.source,
      sourceLabel: batch.sourceLabel,
      topic: batch.topic,
      section: batch.section,
      correct: !incorrect,
      uncertain: !incorrect,
      seconds,
      timingFlag,
      failureCause: batch.failureCause,
      confidence: batch.confidence
    });
    state.mistakeCards.push({
      id: uid("card"),
      kind: "MistakeCard",
      importBatchId: batch.id,
      date: batch.date,
      source: batch.source,
      sourceLabel: batch.sourceLabel,
      section: batch.section,
      topic: batch.topic,
      failureCause: batch.failureCause,
      trainingState: "due",
      timingFlag,
      confidence: batch.confidence,
      seconds,
      reference: `${batch.sourceLabel} #${index + 1}`,
      lesson: data.fixRule.trim() || defaultFixRule(batch.topic, batch.failureCause),
      nextReview: addDays(batch.date, 1),
      intervalIndex: 0,
      attempts: 0,
      misses: 0
    });
  }
  saveState();
  lastParsedImport = null;
  fillImportForm(parseImportText(""));
  byId("import-text").value = "";
  setStatus("ocr-status", `Saved ${batch.sourceLabel}: ${batch.correct}/${batch.questions}. Created ${reviewCount} review cards.`);
  renderAll();
}

function setStatus(id, message) {
  byId(id).textContent = message;
}

function deleteImportBatch(id) {
  const batch = state.importBatches.find((item) => item.id === id);
  if (!batch) return;
  if (!confirm(`Delete import "${batch.sourceLabel}" and its generated review cards?`)) return;
  state.importBatches = state.importBatches.filter((item) => item.id !== id);
  state.sessions = state.sessions.filter((item) => item.importBatchId !== id);
  state.questionAttempts = state.questionAttempts.filter((item) => item.importBatchId !== id);
  state.mistakeCards = state.mistakeCards.filter((item) => item.importBatchId !== id);
  if (state.mistakeCards.every((item) => item.id !== activeReviewId)) activeReviewId = null;
  saveState();
  renderAll();
}

function deleteMistakeCard(id) {
  const card = state.mistakeCards.find((item) => item.id === id);
  if (!card) return;
  if (!confirm(`Delete this ${topicName(card.topic)} review card?`)) return;
  state.mistakeCards = state.mistakeCards.filter((item) => item.id !== id);
  if (activeReviewId === id) activeReviewId = null;
  saveState();
  renderAll();
}

function setupBackup() {
  byId("export-data").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gmat-optimizer-v4-${todayISO()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  });

  byId("backup-input").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const imported = normalizeState(JSON.parse(await file.text()));
      if (byId("backup-mode").value === "replace") {
        state = imported;
      } else {
        state = mergeImportedState(state, imported);
      }
      saveState();
      populateForms();
      renderAll();
      setStatus("backup-status", "Backup imported.");
    } catch (error) {
      setStatus("backup-status", `Import failed: ${error.message}`);
    } finally {
      event.target.value = "";
    }
  });
}

function mergeImportedState(current, incoming) {
  const mergeById = (a, b) => {
    const map = new Map(a.map((item) => [item.id, item]));
    b.forEach((item) => map.set(item.id, item));
    return [...map.values()];
  };
  return normalizeState({
    ...current,
    profile: { ...current.profile, ...incoming.profile },
    sessions: mergeById(current.sessions, incoming.sessions),
    questionAttempts: mergeById(current.questionAttempts, incoming.questionAttempts),
    mistakeCards: mergeById(current.mistakeCards, incoming.mistakeCards),
    importBatches: mergeById(current.importBatches, incoming.importBatches),
    guidedBlocks: mergeById(current.guidedBlocks || [], incoming.guidedBlocks || []),
    activeBlock: current.activeBlock || incoming.activeBlock || null,
    mocks: mergeById(current.mocks, incoming.mocks)
  });
}

function updateReview(id, ratingId) {
  const card = state.mistakeCards.find((item) => item.id === id);
  if (!card) return;
  const rating = reviewRatings[ratingId] || reviewRatings.good;
  card.attempts += 1;
  card.reviewedAt = todayISO();
  card.lastRating = ratingId;
  if (rating.miss) {
    card.misses += 1;
    card.intervalIndex = 0;
    card.trainingState = "failed_redo";
    card.ease = Math.max(1.3, Number(card.ease || 2.5) - 0.2);
    card.nextReview = todayISO();
  } else if (ratingId === "hard") {
    card.intervalIndex = Math.max(0, card.intervalIndex);
    card.trainingState = rating.state;
    card.ease = Math.max(1.3, Number(card.ease || 2.5) - 0.08);
    card.nextReview = addDays(todayISO(), reviewIntervals[card.intervalIndex]);
  } else {
    card.intervalIndex = Math.min(card.intervalIndex + rating.intervalMove, reviewIntervals.length - 1);
    card.trainingState = card.intervalIndex >= reviewIntervals.length - 1 ? "mastered" : "improving";
    card.ease = Math.min(3.2, Number(card.ease || 2.5) + (ratingId === "easy" ? 0.12 : 0.03));
    card.nextReview = addDays(todayISO(), reviewIntervals[card.intervalIndex]);
  }
  activeReviewId = null;
  activeReviewRevealed = false;
  saveState();
  renderAll();
}

function renderReview() {
  const items = orderedReviewCards();
  if (!items.length) {
    byId("review-grid").innerHTML = `<div class="empty-state">No review items yet.</div>`;
    return;
  }
  let activeIndex = Math.max(0, items.findIndex((item) => item.id === activeReviewId));
  if (!activeReviewId || activeIndex < 0) {
    activeIndex = Math.max(0, items.findIndex((item) => item.trainingState !== "mastered" && item.nextReview <= todayISO()));
    activeReviewId = items[activeIndex].id;
  }
  const item = items[activeIndex];
  const dueText = item.trainingState === "mastered" ? "Mastered" : item.nextReview <= todayISO() ? "Due now" : `Due ${formatDate(item.nextReview)}`;
  const behind = items.filter((candidate) => candidate.id !== item.id).slice(0, 5);
  const leech = Number(item.misses || 0) >= 2;
  const ratingButtons = Object.entries(reviewRatings).map(([id, rating]) => `
    <button class="mini-button rating-${id}" type="button" data-review="${item.id}" data-rating="${id}">${rating.label}</button>
  `).join("");
  byId("review-grid").innerHTML = `
    <div class="flashcard-layout">
      <section class="flashcard-stage">
        <div class="stack-shadow one"></div>
        <div class="stack-shadow two"></div>
        <article class="review-card flashcard ${item.nextReview <= todayISO() ? "today" : ""}">
          <div class="flashcard-topline">
            <span>${activeIndex + 1} / ${items.length}</span>
            <span>${escapeHtml(dueText)}${leech ? " / Rebuild" : ""}</span>
          </div>
          <div>
            <div class="review-meta">${escapeHtml(item.section)} / ${escapeHtml(causeFamily(item.failureCause))} / ${escapeHtml(stateLabel(item.trainingState))}</div>
            <h3>${escapeHtml(topicName(item.topic))}</h3>
            ${activeReviewRevealed
              ? `<p>${escapeHtml(item.lesson || defaultFixRule(item.topic, item.failureCause) || "No fix rule recorded.")}</p>`
              : `<p class="recall-prompt">Attempt the redo first. Reveal the fix only after you have committed to an answer path.</p>`}
          </div>
          ${activeReviewRevealed ? `
            <dl class="flashcard-facts">
              <div><dt>Cause</dt><dd>${escapeHtml(causeLabel(item.failureCause))}</dd></div>
              <div><dt>Timing</dt><dd>${escapeHtml(item.timingFlag || "unknown")}</dd></div>
              <div><dt>Source</dt><dd>${escapeHtml(item.reference || item.sourceLabel)}</dd></div>
              <div><dt>Confidence</dt><dd>${Math.round((item.confidence || 0) * 100)}%</dd></div>
            </dl>
            <div class="review-actions rating-actions">
              ${ratingButtons}
              <button class="mini-button danger" type="button" data-delete-card="${item.id}">Delete</button>
            </div>
          ` : `
            <dl class="flashcard-facts single">
              <div><dt>Source</dt><dd>${escapeHtml(item.reference || item.sourceLabel)}</dd></div>
              <div><dt>Target</dt><dd>${escapeHtml(getTopic(item.topic).ttpModule)}</dd></div>
            </dl>
            <div class="review-actions reveal-actions">
              <button class="mini-button" type="button" data-review-nav="-1">Previous</button>
              <button class="mini-button reveal" type="button" data-review-reveal="${item.id}">Show Fix</button>
              <button class="mini-button" type="button" data-review-nav="1">Next</button>
              <button class="mini-button danger" type="button" data-delete-card="${item.id}">Delete</button>
            </div>
          `}
        </article>
      </section>
      <aside class="review-side">
        <h3>Up next</h3>
        <div class="queue-summary">
          <span>${dueCards().length} due</span>
          <span>${leechCards().length} rebuild</span>
          <span>${reviewCap()} cap</span>
        </div>
        ${behind.length ? behind.map((card) => `
          <button class="queue-card" type="button" data-review-select="${card.id}">
            <strong>${escapeHtml(topicName(card.topic))}</strong>
            <span>${escapeHtml(causeLabel(card.failureCause))} / ${card.nextReview <= todayISO() ? "Due" : formatDate(card.nextReview)}${Number(card.misses || 0) >= 2 ? " / Rebuild" : ""}</span>
          </button>
        `).join("") : `<p class="muted-copy">No more cards in the queue.</p>`}
      </aside>
    </div>
  `;

  document.querySelectorAll("[data-review]").forEach((button) => {
    button.addEventListener("click", () => updateReview(button.dataset.review, button.dataset.rating));
  });
  document.querySelectorAll("[data-review-select]").forEach((button) => {
    button.addEventListener("click", () => {
      activeReviewId = button.dataset.reviewSelect;
      activeReviewRevealed = false;
      renderReview();
    });
  });
}

function orderedReviewCards() {
  return [...state.mistakeCards].sort((a, b) => {
    const aDue = a.trainingState !== "mastered" && a.nextReview <= todayISO();
    const bDue = b.trainingState !== "mastered" && b.nextReview <= todayISO();
    if (aDue !== bDue) return aDue ? -1 : 1;
    if (a.trainingState === "mastered" && b.trainingState !== "mastered") return 1;
    if (b.trainingState === "mastered" && a.trainingState !== "mastered") return -1;
    const riskDelta = memoryRiskScore(b) - memoryRiskScore(a);
    if (riskDelta !== 0) return riskDelta;
    return a.nextReview.localeCompare(b.nextReview);
  });
}

function moveReview(delta) {
  const items = orderedReviewCards();
  if (!items.length) return;
  const index = Math.max(0, items.findIndex((item) => item.id === activeReviewId));
  const nextIndex = (index + delta + items.length) % items.length;
  activeReviewId = items[nextIndex].id;
  activeReviewRevealed = false;
  renderReview();
}

function renderSessions() {
  const list = [...state.sessions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12);
  if (!list.length) {
    byId("session-list").innerHTML = `<div class="empty-state">No sessions logged yet.</div>`;
    return;
  }
  byId("session-list").innerHTML = list.map(renderSessionItem).join("");
}

function renderSessionItem(session) {
  const accuracy = session.questions ? Math.round((session.correct / session.questions) * 100) : 0;
  return `
    <div class="session-item">
      <div class="session-meta">${formatDate(session.date)}</div>
      <div>
        <div class="session-topic">${escapeHtml(topicName(session.topic))}</div>
        <div class="session-meta">${escapeHtml(session.source)} / ${escapeHtml(session.sourceLabel || session.setType)}</div>
      </div>
      <div class="session-stat">${accuracy}%</div>
      <div class="session-stat">${session.avgSeconds || 0}s/q</div>
    </div>
  `;
}

function renderImports() {
  const list = [...state.importBatches].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10);
  byId("import-list").innerHTML = list.length
    ? list.map((batch) => `
      <div class="session-item import-item">
        <div class="session-meta">${formatDate(batch.date)}</div>
        <div>
          <div class="session-topic">${escapeHtml(batch.sourceLabel)}</div>
          <div class="session-meta">${escapeHtml(topicName(batch.topic))} / ${escapeHtml(batch.setType)} / ${escapeHtml(batch.difficulty)}</div>
        </div>
        <div class="session-stat">${batch.correct}/${batch.questions}</div>
        <div class="session-stat">${batch.wrong + batch.uncertain} cards</div>
        <button class="mini-button danger" type="button" data-delete-import="${batch.id}">Delete</button>
      </div>
    `).join("")
    : `<div class="empty-state">No imports yet. Paste a TTP result or drop a screenshot.</div>`;
}

function renderMocks() {
  renderScheduleBoard();
  byId("mock-list").innerHTML = state.mocks.map((mock) => {
    const className = `${mock.status === "completed" ? "completed" : ""} ${mock.status === "real" ? "real" : ""}`;
    return `
      <article class="mock-card ${className}">
        <div class="mock-index">${escapeHtml(mock.label)}</div>
        <div>
          <h3>${formatDate(mock.date)} / ${escapeHtml(mock.source)}</h3>
          <p>${escapeHtml(mock.purpose)}</p>
        </div>
        <div class="mock-score">${escapeHtml(mock.score || "Planned")}<br><span class="review-meta">${escapeHtml(mock.split || mock.status)}</span></div>
      </article>
    `;
  }).join("");
}

function renderScheduleBoard() {
  const assignment = exactAssignment();
  const mix = assignment.mix.length ? assignment.mix : adaptiveMix(assignment.count);
  const tomorrow = addDays(todayISO(), 1);
  const tomorrowMode = getDayMode(tomorrow);
  const topThree = rankedTopics().filter((topic) => topic.id !== "unknown" && topic.id !== "verbal-maintenance").slice(0, 3);
  const due = dueCards().length;
  const leeches = leechCards().length;
  const cards = [
    {
      title: "Tonight",
      meta: getDayMode(),
      bullets: [
        assignment.reviewBlock,
        `${assignment.count} TTP questions`,
        `${assignment.targetAccuracy}% target accuracy`
      ]
    },
    {
      title: "Tomorrow",
      meta: tomorrowMode,
      bullets: [
        `${topThree[0].ttpModule}: ${topThree[0].assignment}`,
        tomorrowMode === "Norvestor evening" ? "Keep it short and timed" : "Add a concept block",
        "Import before stopping"
      ]
    },
    {
      title: "This week",
      meta: "Fluid priorities",
      bullets: topThree.map((topic) => `${topic.name}: ${riskLabel(topic.risk)}`)
    },
    {
      title: "Interleaved set",
      meta: `${assignment.count} questions`,
      bullets: mix.map((item) => `${item.count} ${item.topic.name}`)
    },
    {
      title: "Repair load",
      meta: `${due} due / ${leeches} rebuild`,
      bullets: [
        `Daily cap: ${assignment.reviewCap} cards`,
        due > assignment.reviewCap ? "Stop new volume after cap" : "New volume allowed",
        leeches ? "Repeat offenders need concept work" : "No repeat offenders"
      ]
    },
    {
      title: "Weekend",
      meta: "Deep work",
      bullets: [
        "Concept block",
        "Timed mixed set",
        "Repair session"
      ]
    },
    {
      title: "Mock checkpoint",
      meta: `${nextMock().label} / ${formatDate(nextMock().date)}`,
      bullets: [
        nextMock().source,
        nextMock().purpose,
        "Blind review before explanations"
      ]
    }
  ];
  byId("schedule-board").innerHTML = cards.map((card) => `
    <article class="schedule-card">
      <span>${escapeHtml(card.meta)}</span>
      <h3>${escapeHtml(card.title)}</h3>
      <ul>${card.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>
    </article>
  `).join("");
}

function renderTaxonomy() {
  byId("taxonomy-grid").innerHTML = failureCauses.map((cause) => `
    <div class="taxonomy-item">
      <strong>${escapeHtml(cause.label)}</strong>
      <span>${escapeHtml(cause.family)}</span>
    </div>
  `).join("");
}

function renderAll() {
  renderOxfordInspiration();
  renderDashboard();
  renderCoach();
  renderSessions();
  renderImports();
  renderReview();
  renderMocks();
  renderTaxonomy();
}

renderTabs();
setupQuickActions();
setupGlobalActions();
populateForms();
setupForms();
setupImport();
setupBackup();
setupBlockTicker();
fillImportForm(parseImportText(""));
renderAll();
const initialTab = window.location.hash.replace("#", "").replace(/^tab-/, "");
if (initialTab && byId(initialTab)?.classList.contains("tab-panel")) openTab(initialTab);

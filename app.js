const STORAGE_KEY_V2 = "erik-gmat-optimizer-v2";
const STORAGE_KEY_V1 = "erik-gmat-optimizer-v1";
const SCHEMA_VERSION = 2;

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

const sectionOptions = ["Quant", "DI", "Verbal", "Unknown"];
const reviewIntervals = [1, 3, 7, 14, 30];

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
    misses: Number(error.misses || 0)
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
  const reviewGap = reviewFailureRate(topic.id) * 26;
  return Math.round(baselineGap + priorityBoost + accuracyGap + timeGap + dueGap + reviewGap + recencyPenalty(topic.id));
}

function rankedTopics() {
  return topics
    .filter((topic) => topic.id !== "verbal-maintenance" || verbalNeedsWork())
    .map((topic) => ({ ...topic, risk: topicRisk(topic) }))
    .sort((a, b) => b.risk - a.risk);
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
    reviewBlock: due.length ? `${due.length} due card${due.length === 1 ? "" : "s"} before new work` : "10-minute clean redo sweep",
    actions: [
      ["Open TTP", `${module.module}: ${module.label}.`],
      ["Do the set", `${count} questions, ${minutes} minutes max, ${modeText.toLowerCase()}.`],
      ["Bridge it back", "Screenshot or paste the result into Import; confirm the parsed batch once."]
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
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setupQuickActions() {
  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-jump]");
    if (!target) return;
    openTab(target.dataset.jump);
  });
}

function renderDashboard() {
  const today = todayISO();
  const assignment = exactAssignment();
  byId("today-date").textContent = formatDate(today);
  byId("today-mode").textContent = assignment.mode;
  byId("assignment-hero").innerHTML = `
    <span class="assignment-source">TTP next</span>
    <strong>${escapeHtml(assignment.module.module)}</strong>
    <span>${escapeHtml(assignment.module.label)}</span>
  `;
  byId("assignment-spec").innerHTML = [
    ["Questions", assignment.count],
    ["Difficulty", assignment.difficulty],
    ["Mode", assignment.setMode],
    ["Target", `${assignment.targetAccuracy}% / ${assignment.targetSeconds}s`],
    ["Review", assignment.reviewBlock]
  ].map(([key, value]) => `<div><dt>${key}</dt><dd>${escapeHtml(value)}</dd></div>`).join("");
  byId("today-actions").innerHTML = assignment.actions
    .map(([title, body]) => `<li><strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span></li>`)
    .join("");
  byId("routine-strip").innerHTML = ["Repair first", "No hidden scraping", "Screenshot bridge", "Confirm uncertain categories"]
    .map((item) => `<span class="pill">${item}</span>`)
    .join("");

  const metrics = [
    {
      label: "Quant readiness",
      value: `${sectionReadiness("Quant")}%`,
      note: "Accuracy, pace, and review debt"
    },
    {
      label: "DI readiness",
      value: `${sectionReadiness("DI")}%`,
      note: "Charts and DI process discipline"
    },
    {
      label: "Review debt",
      value: reviewDebtLabel(),
      note: `${dueCards().length} due / ${state.mistakeCards.length} active cards`
    },
    {
      label: "Pacing risk",
      value: pacingRisk(),
      note: latestBottleneck()
    }
  ];
  byId("metric-grid").innerHTML = metrics.map(renderMetric).join("");
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
      const accLabel = accuracy == null ? "No local reps" : `${accuracy}% recent`;
      const secLabel = seconds == null ? "No pace data" : `${seconds}s/q`;
      return `
        <div class="topic-row">
          <div>
            <div class="topic-name">${escapeHtml(topic.name)}</div>
            <div class="topic-meta">${escapeHtml(topic.ttpModule)} / P${topic.priority} / ESR ${topic.baseline}th pct</div>
          </div>
          <div class="topic-score">${accLabel}</div>
          <div class="topic-score">${secLabel}</div>
          <div class="topic-score">${due} due</div>
          <div class="risk-bar" aria-label="Priority ${capped}">
            <span style="width: ${capped}%"></span>
          </div>
          <div class="topic-action">${escapeHtml(topic.assignment)}</div>
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
      source: data.source.trim() || "Custom",
      sourceLabel: data.reference.trim() || topic.name,
      section: data.section,
      topic: data.topic,
      failureCause: data.failureCause,
      trainingState: data.trainingState,
      timingFlag: inferTimingFlag(Number(data.seconds), topic, false),
      confidence: 0.92,
      seconds: Number(data.seconds),
      reference: data.reference.trim(),
      lesson: data.lesson.trim(),
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
    if (!confirm("Reset local GMAT optimizer data to the seeded V2 plan?")) return;
    state = structuredClone(defaultState);
    saveState();
    populateForms();
    renderAll();
  });
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
      correct: false,
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

function setupBackup() {
  byId("export-data").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gmat-optimizer-v2-${todayISO()}.json`;
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
    mocks: mergeById(current.mocks, incoming.mocks)
  });
}

function updateReview(id, hit) {
  const card = state.mistakeCards.find((item) => item.id === id);
  if (!card) return;
  card.attempts += 1;
  if (!hit) {
    card.misses += 1;
    card.intervalIndex = 0;
    card.trainingState = "failed_redo";
  } else {
    card.intervalIndex = Math.min(card.intervalIndex + 1, reviewIntervals.length - 1);
    card.trainingState = card.intervalIndex >= reviewIntervals.length - 1 ? "mastered" : "improving";
  }
  card.nextReview = addDays(todayISO(), reviewIntervals[card.intervalIndex]);
  saveState();
  renderAll();
}

function renderReview() {
  const items = [...state.mistakeCards].sort((a, b) => a.nextReview.localeCompare(b.nextReview));
  if (!items.length) {
    byId("review-grid").innerHTML = `<div class="empty-state">No review items yet.</div>`;
    return;
  }
  byId("review-grid").innerHTML = items.map((item) => {
    const dueClass = item.nextReview < todayISO() ? "overdue" : item.nextReview === todayISO() ? "today" : "";
    const dueText = item.trainingState === "mastered" ? "Mastered" : item.nextReview <= todayISO() ? "Due now" : `Due ${formatDate(item.nextReview)}`;
    return `
      <article class="review-card ${dueClass}">
        <div>
          <div class="review-meta">${escapeHtml(item.section)} / ${escapeHtml(causeFamily(item.failureCause))} / ${escapeHtml(stateLabel(item.trainingState))}</div>
          <h3>${escapeHtml(topicName(item.topic))}</h3>
          <p>${escapeHtml(item.lesson || defaultFixRule(item.topic, item.failureCause) || "No fix rule recorded.")}</p>
        </div>
        <div class="review-meta">
          ${escapeHtml(dueText)} / ${escapeHtml(item.source)} / ${escapeHtml(item.reference || item.sourceLabel)}
          <br>${escapeHtml(causeLabel(item.failureCause))} / ${escapeHtml(item.timingFlag || "unknown")} / ${Math.round((item.confidence || 0) * 100)}%
        </div>
        <div class="review-actions">
          <button class="mini-button hit" type="button" data-review="${item.id}" data-hit="true">Got It</button>
          <button class="mini-button miss" type="button" data-review="${item.id}" data-hit="false">Missed</button>
        </div>
      </article>
    `;
  }).join("");

  document.querySelectorAll("[data-review]").forEach((button) => {
    button.addEventListener("click", () => updateReview(button.dataset.review, button.dataset.hit === "true"));
  });
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
      <div class="session-item">
        <div class="session-meta">${formatDate(batch.date)}</div>
        <div>
          <div class="session-topic">${escapeHtml(batch.sourceLabel)}</div>
          <div class="session-meta">${escapeHtml(topicName(batch.topic))} / ${escapeHtml(batch.setType)} / ${escapeHtml(batch.difficulty)}</div>
        </div>
        <div class="session-stat">${batch.correct}/${batch.questions}</div>
        <div class="session-stat">${batch.wrong + batch.uncertain} cards</div>
      </div>
    `).join("")
    : `<div class="empty-state">No imports yet. Paste a TTP result or drop a screenshot.</div>`;
}

function renderMocks() {
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

function renderTaxonomy() {
  byId("taxonomy-grid").innerHTML = failureCauses.map((cause) => `
    <div class="taxonomy-item">
      <strong>${escapeHtml(cause.label)}</strong>
      <span>${escapeHtml(cause.family)}</span>
    </div>
  `).join("");
}

function renderAll() {
  renderDashboard();
  renderSessions();
  renderImports();
  renderReview();
  renderMocks();
  renderTaxonomy();
}

renderTabs();
setupQuickActions();
populateForms();
setupForms();
setupImport();
setupBackup();
fillImportForm(parseImportText(""));
renderAll();

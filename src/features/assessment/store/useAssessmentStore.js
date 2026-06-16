import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ALL_QUESTIONS } from "../config/questions";

const initialState = {
  currentStep: 0,
  responses: {},
  isReversing: false,
};

const clampStep = (step) => {
  if (step < 0) return 0;
  if (step > ALL_QUESTIONS.length) return ALL_QUESTIONS.length;
  return step;
};

const normaliseLikert = ({ value, min, max, reverseScored }) => {
  if (value == null) return null;
  const clamped = Math.min(Math.max(value, min), max);
  const raw = reverseScored ? max - (clamped - min) : clamped - min;
  const range = max - min;
  return range === 0 ? 0 : raw / range;
};

const RESCALE_REVERSE = (v) => 7 - v;

const computeScores = (responses) => {
  const aggregates = {
    academic: { total: 0, count: 0 },
    personality: { total: 0, count: 0 },
  };

  ALL_QUESTIONS.forEach((question) => {
    const rawValue = responses[question.key];
    if (rawValue == null) return;

    if (question.type === "likert") {
      const normalised = normaliseLikert({
        value: rawValue,
        min: question.min,
        max: question.max,
        reverseScored: Boolean(question.reverseScored),
      });
      if (normalised != null) {
        const bucket =
          question.category === "Academic" ? "academic" : "personality";
        aggregates[bucket].total += normalised;
        aggregates[bucket].count += 1;
      }
    }
  });

  const toPercent = (total, count) => {
    if (count === 0) return null;
    return Math.round((total / count) * 100);
  };
  return {
    academicMomentum: toPercent(
      aggregates.academic.total,
      aggregates.academic.count,
    ),
    personalitySync: toPercent(
      aggregates.personality.total,
      aggregates.personality.count,
    ),
  };
};

export const useAssessmentStore = create(
  devtools((set, get) => ({
    ...initialState,
    totalSteps: ALL_QUESTIONS.length,
    nextStep: () =>
      set((state) => ({
        currentStep: clampStep(state.currentStep + 1),
        isReversing: false,
      })),
    prevStep: () =>
      set((state) => ({
        currentStep: clampStep(state.currentStep - 1),
        isReversing: true,
      })),
    setAnswer: (key, value) =>
      set((state) => ({
        responses: {
          ...state.responses,
          [key]: value,
        },
      })),
    getAnswerForKey: (key) => {
      const { responses } = get();
      return responses[key] ?? null;
    },
    reset: () => set({ ...initialState }),
    getProgress: () => {
      const answered = Object.keys(get().responses).length;
      const total = get().totalSteps;
      if (total === 0) return 0;
      return Math.round((answered / total) * 100);
    },
    getFinalPayload: () => {
      const { responses } = get();
      const nullFields = Object.entries(responses)
        .filter(([, v]) => v == null)
        .map(([k]) => k);
      if (nullFields.length) console.warn("Unanswered fields:", nullFields);
      return {
        completedAt: new Date().toISOString(),
        responses,
        analytics: computeScores(responses),
      };
    },
    getApiPayload: () => {
      const { responses } = get();
      console.log("payload before normalization:", responses);

      // ── Normalization maps: raw UI option → compact API value ──
      const GPA_MAP = {
        "4.0 – 3.5": "3.5–4.0",
        "3.49 – 3.0": "3.0–3.49",
        "2.99 – 2.5": "2.5–2.99",
        "2.49 – 2.0": "2.0–2.49",
        "Below 2.0": "Below 2.0",
        "First semester / No GPA yet": "No GPA",
      };

      const EXAM_PREP_MAP = {
        "2+ weeks before": "2+ weeks before",
        "1–2 weeks before": "1-2 weeks before",
        "3–7 days before": "3-7 days before",
        "1–2 days before": "1-2 days before",
        "Night before": "Night before",
      };

      const WORK_APPROACH_MAP = {
        "Highly structured and perfection-oriented": "Structured",
        "Balanced between structure and flexibility": "Balanced",
        "Flexible and outcome-focused": "Flexible",
      };

      const TIME_PRESSURE_MAP = {
        "I like finishing things early so I can relax and clear my head":
          "Finish early",
        "I work best under pressure and enjoy the adrenaline of last-minute deadlines":
          "Pressure",
        "It depends on the task": "Depends",
      };

      const UNIVERSITY_PRIORITY_MAP = {
        "Most of my energy goes to university": "Most to uni",
        "University is important, but balanced with other commitments":
          "Balanced",
        "University often competes with major life/work commitments":
          "competes",
      };

      const STUDY_HOURS_MAP = {
        "0–5 hours": "0–5",
        "5–10 hours": "5–10",
        "10–20 hours": "10–20",
        "20–30 hours": "20–30",
        "30+ hours": "30+",
      };

      const WORKING_STYLE_MAP = {
        "Work together most of the time": "Together",
        "Plan together, work independently": "Plan+independent",
        "Mostly independent, sync when needed": "Mostly independent",
      };

      const normalize = (map, raw) => (raw != null ? (map[raw] ?? raw) : null);

      // Safe reverse scale — returns null if input is null/undefined
      const safeReverse = (val) => (val == null ? null : 7 - val);

      return {
        // ── Strings (singleSelect) ──────────────────────────────
        school_level: responses.year ?? null,
        gpa: normalize(GPA_MAP, responses.gpa),
        exam_prep_start: normalize(EXAM_PREP_MAP, responses.study_start),
        work_approach: normalize(WORK_APPROACH_MAP, responses.work_approach),
        time_pressure_style: normalize(
          TIME_PRESSURE_MAP,
          responses.time_pressure,
        ),
        university_priority: normalize(
          UNIVERSITY_PRIORITY_MAP,
          responses.commitment_priority,
        ),
        reliability: responses.commitment_reliability ?? null,
        study_hours: normalize(STUDY_HOURS_MAP, responses.study_effort),
        working_style: normalize(WORKING_STYLE_MAP, responses.working_style),

        // ── Numbers (likert) ────────────────────────────────────
        academic_mindset: responses.academic_mindset ?? null,
        extraversion1: responses.ext_1 ?? null,
        extraversion2: safeReverse(responses.ext_2_rev),
        conscientiousness1: responses.cons_1 ?? null,
        conscientiousness2: safeReverse(responses.cons_2_rev),
        agreeableness1: responses.agr_1 ?? null,
        agreeableness2: safeReverse(responses.agr_2_rev),
        neuroticism1: safeReverse(responses.neu_1_rev),
        neuroticism2: responses.neu_2 ?? null,
        openness1: responses.opn_1 ?? null,
        openness2: safeReverse(responses.opn_2_rev),
      };
    },
  })),
);

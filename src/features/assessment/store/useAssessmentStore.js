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
        const bucket = question.category === "Academic DNA" ? "academic" : "personality";
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
    academicMomentum: toPercent(aggregates.academic.total, aggregates.academic.count),
    personalitySync: toPercent(aggregates.personality.total, aggregates.personality.count),
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
      return {
        completedAt: new Date().toISOString(),
        responses,
        analytics: computeScores(responses),
      };
    },
  }))
);

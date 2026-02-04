import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  file: null,
  traits: {
    introvertExtrovert: 50,
    analyticalCreative: 50,
    independentCollaborative: 50,
  },
  archetype: null,
  extractedTags: [],
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    nextStep: (state) => {
      if (state.step < 5) {
        state.step += 1;
      }
    },
    previousStep: (state) => {
      if (state.step > 1) {
        state.step -= 1;
      }
    },
    setFile: (state, action) => {
      state.file = action.payload;
    },
    updateTrait: (state, action) => {
      const { trait, value } = action.payload;
      state.traits[trait] = value;
    },
    setArchetype: (state, action) => {
      state.archetype = action.payload;
    },
    setExtractedTags: (state, action) => {
      state.extractedTags = action.payload;
    },
    resetOnboarding: () => initialState,
  },
});

export const {
  setStep,
  nextStep,
  previousStep,
  setFile,
  updateTrait,
  setArchetype,
  setExtractedTags,
  resetOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;

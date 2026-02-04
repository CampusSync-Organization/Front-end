import { useSelector } from "react-redux";
import OnboardingLayout from "../../../components/onboarding/OnboardingLayout";
import Step1_SocialSync from "../../../components/onboarding/Step1_SocialSync";
import Step2_CVScanner from "../../../components/onboarding/Step2_CVScanner";
import Step3_VibeCheck from "../../../components/onboarding/Step3_VibeCheck";
import Step4_Archetype from "../../../components/onboarding/Step4_Archetype";
import Step5_MatchPreview from "../../../components/onboarding/Step5_MatchPreview";

const OnboardingPage = () => {
  const currentStep = useSelector((state) => state.onboarding.step);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1_SocialSync />;
      case 2:
        return <Step2_CVScanner />;
      case 3:
        return <Step3_VibeCheck />;
      case 4:
        return <Step4_Archetype />;
      case 5:
        return <Step5_MatchPreview />;
      default:
        return <Step1_SocialSync />;
    }
  };

  return <OnboardingLayout>{renderStep()}</OnboardingLayout>;
};

export default OnboardingPage;

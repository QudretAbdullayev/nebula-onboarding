import { useState } from 'react';
import { SetBadges } from '@/features/onboarding/components/SetBadges/SetBadges';
import { SetEvaluation } from '@/features/onboarding/components/SetEvaluation/SetEvaluation';
import Hierarchy from '../components/Hierarchy/Hierarchy';


export const OnboardingPage = () => {
    const [step, setStep] = useState(5);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => Math.max(0, prev - 1));

    switch (step) {
        case 3:
            return <SetBadges onNext={nextStep} onBack={prevStep} />;
        case 4:
            return <SetEvaluation onBack={prevStep} onNext={nextStep} />;
        case 5:
            return <Hierarchy onBack={prevStep} onNext={nextStep} />; 
        default:
            return null;
    }
};

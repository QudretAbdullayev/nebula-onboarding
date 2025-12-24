import { useState } from 'react';
import { Welcome } from '@/features/onboarding/components/Welcome/Welcome';
import { SetCompany } from '@/features/onboarding/components/SetCompany/SetCompany';
import { SetPassword } from '@/features/onboarding/components/SetPassword/SetPassword';
import { SetBadges } from '@/features/onboarding/components/SetBadges/SetBadges';
import { SetEvaluation } from '@/features/onboarding/components/SetEvaluation/SetEvaluation';
import { SetFlow } from '@/features/onboarding/components/SetFlow/SetFlow';

export const OnboardingPage = () => {
    const [step, setStep] = useState(5);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => Math.max(0, prev - 1));

    switch (step) {
        case 0:
            return <Welcome onNext={nextStep} />;
        case 1:
            return <SetCompany onNext={nextStep} />;
        case 2:
            return <SetPassword onNext={nextStep} />;
        case 3:
            return <SetBadges onNext={nextStep} onBack={prevStep} />;
        case 4:
            return <SetEvaluation onBack={prevStep} onNext={nextStep} />;
        case 5:
            return <SetFlow onBack={prevStep} onNext={nextStep} />; // Final step
        default:
            return <Welcome onNext={nextStep} />;
    }
};

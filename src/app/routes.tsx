import { Routes, Route } from 'react-router-dom';
import { LandingPage } from '@/features/landing/pages/LandingPage';
import { OnboardingPage } from '@/features/onboarding/pages/OnboardingPage';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/app" element={<div>Dashboard Placeholder</div>} />
        </Routes>
    );
};

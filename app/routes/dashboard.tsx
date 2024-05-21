// app/routes/onboarding.jsx
import { Outlet } from '@remix-run/react';

export default function OnboardingLayout() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Outlet />
    </div>
  );
}
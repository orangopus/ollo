// app/routes/onboarding/step3.jsx
import { useNavigate } from '@remix-run/react';

export default function OnboardingStep3() {
  const navigate = useNavigate();

  const handleFinish = () => {
    navigate('/dashboard');
  };

  return (
    <div>
      <h2>Step 3: Confirmation</h2>
      <p>Review your information and confirm.</p>
      <button onClick={handleFinish}>Finish</button>
    </div>
  );
}
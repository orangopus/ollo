import { useNavigate } from '@remix-run/react';

export default function OnboardingStep2() {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/onboarding/step3');
  };

  return (
    <div>
      <h2>Step 2: Additional Information</h2>
      <form onSubmit={handleNext}>
        <div>
          <label htmlFor="age">Bio:</label>
          <input type="text" required />
        </div>
        <button type="submit">Next</button>
      </form>
    </div>
  );
}

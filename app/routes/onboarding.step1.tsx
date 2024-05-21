import { useNavigate } from '@remix-run/react';

export default function OnboardingStep1() {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/onboarding/step2');
  };

  return (
    <div>
      <h2>Step 1: Basic Information</h2>
      <form onSubmit={handleNext}>
        <div>
          <label htmlFor="name">Username:</label>
          <input type="text" id="name" name="name" required />
        </div>
        <button type="submit">Next</button>
      </form>
    </div>
  );
}
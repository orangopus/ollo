import { redirect, json, Outlet } from "@remix-run/react";
import { createClient } from "@supabase/supabase-js";

export default function OnboardingLayout() {
  return (
    <div>
      <h1>Onboarding</h1>
      <Outlet />
      <h2>Username</h2>
      <input className="input" type="text" placeholder="Username" />
      <br />
      <h2>Bio</h2>
      <input className="input" type="text" placeholder="Bio" />
    </div>
  );
}
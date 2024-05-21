import { redirect, json, Outlet } from "@remix-run/react";
import { createClient } from "@supabase/supabase-js";

export let loader = async ({ request }) => {

        return redirect("/dashboard");

};

export default function OnboardingLayout() {
  return (
    <div>
      <h1>Onboarding</h1>
      <Outlet />
    </div>
  );
}
import { useOutletContext } from "@remix-run/react";
import type { SupabaseOutletContext } from "~/root";

export default function Login() {
  
  const {supabase} = useOutletContext<SupabaseOutletContext>();
  
    const handleDiscordLogin = async () => {
      const {error} = await supabase.auth.signInWithOAuth({
        provider: 'discord'
      })

      if (error) {
        console.log(error);
      }
    }
  
    const handleLogout = async () => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.log(error);
      }
    }
  
    return (
      <>
        <button onClick={handleDiscordLogin}>Discord Login</button>
        <button onClick={handleLogout}>Logout</button>
      </>
    )
  }
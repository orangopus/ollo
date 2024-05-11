import { useOutletContext } from "@remix-run/react";
import { SupabaseClient } from "@supabase/auth-helpers-remix";
import { SupabaseContext } from "context/supabaseContext";
import { Database } from "database.types";
import { useContext } from "react";



export default function Login() {
  
  const supabase = useContext(SupabaseContext)
  
    const handleDiscordLogin = async () => {
      await supabase.auth.signInWithOAuth({
        provider: 'discord'
      })
    }
  
    const handleLogout = async () => {
      await supabase.auth.signOut()
    }
  
    return (
      <>
        <button onClick={handleDiscordLogin}>Discord Login</button>
        <button onClick={handleLogout}>Logout</button>
      </>
    )
  }
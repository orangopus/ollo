import { useLoaderData } from "@remix-run/react"
import { type LoaderFunctionArgs } from '@remix-run/node'
import { createServerClient, parse, serialize, createBrowserClient } from '@supabase/ssr'
import { redirect } from '@remix-run/react';
import { useContext } from "react";
import { SupabaseContext } from "context/supabaseContext";
import { UserContext } from "context/UserContext";

export async function loader({ request }: LoaderFunctionArgs) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') || '/'
    const headers = new Headers()
  
    if (code) {
      const cookies = parse(request.headers.get('Cookie') ?? '')
      const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
        cookies: {
          get(key) {
            return cookies[key]
          },
          set(key, value, options) {
            headers.append('Set-Cookie', serialize(key, value, options))
          },
          remove(key, options) {
            headers.append('Set-Cookie', serialize(key, '', options))
          },
        },
      })
  
      const { error } = await supabase.auth.exchangeCodeForSession(code)
  
      if (!error) {
        return redirect(next, { headers })
      }
    }
  
    // return the user to an error page with instructions
    return redirect('/auth/auth-code-error', { headers })
  }

// Discord Auth Login
export default async function Dashboard() {
    const loaderData = useLoaderData();
    const supabase = useContext(SupabaseContext)
    const session = await supabase.auth.getSession();

    console.log(session)

    const logIn = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "discord",
            options: {
              redirectTo: 'http://localhost:5173/dashboard',
            },
          })
          if (data.url) {
            redirect(data.url) // use the redirect API for your server framework
          }
    }
    return (
        <>
        <div>
            <button onClick={logIn}>Log In</button>
        </div>
        </>
    )
}
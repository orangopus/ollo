import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import "~/styles/styles.css";
import 'swiper/css';
import '@ionic/react/css/ionic-swiper.css';
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";
import { createServerClient, parse, serialize, createBrowserClient } from '@supabase/ssr'
import { SupabaseContext } from "context/supabaseContext";

import { useEffect, useState } from "react";
import { json } from '@remix-run/node' // change this import to whatever runtime you are using
import { SupabaseClient, User, createClient } from "@supabase/supabase-js";
import Nav from "~/components/Nav";
import { Database } from "database.types";
import createServerSupabase from "utils/supabase.server";
import { HypeRateProvider } from "context/HypeRateContext";

type TypedSupabaseClient = SupabaseClient<Database>

export type SupabaseOutletContext = {
  supabase: TypedSupabaseClient;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
 const env = {
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!
 }

 const response = new Response();
 const supabase = createServerSupabase({request, response})

 const {
  data: { session }, 
 } = await supabase.auth.getSession();

 return json({env, session}, {headers: response.headers})
}

export default function App() {
  const { env, session } = useLoaderData<typeof loader>();

  const [supabase] = useState(() => 
    createBrowserClient<Database>(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY)
  )

  console.log(session?.user.user_metadata.provider_id)

  useEffect(() => {
    const updateProfile = async () => {
      // Check if user is logged in
      if (session?.user) {
        // Retrieve the Discord ID from the session
        const discordId = session?.user.user_metadata.provider_id;
        
        // Get the current user's profile from Supabase
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session?.user.id)
          .single();

        if (error) { 
          console.error('Error fetching profile:', error.message);
          return;
        }

        // If the user's profile doesn't exist, create a new profile
        if (!profiles) {
          const { data: newProfile, error: profileError } = await supabase
            .from('profiles')
            .insert([{ id: session?.user.id, discord_id: discordId }]);
          
          if (profileError) {
            console.error('Error creating profile:', profileError.message);
            return;
          }
          
          console.log('New profile created:', newProfile);
        } else {
          // If the user's profile already exists, update the Discord ID
          const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update({ discord_id: discordId })
            .eq('id', session?.user.id);
          
          if (updateError) {
            console.error('Error updating profile:', updateError.message);
            return;
          }
          
          console.log('Profile updated:', updatedProfile);
        }
      }
    };

    updateProfile();
  }, [session, supabase]);

  return (
    <SupabaseContext.Provider value={supabase}>
        <html lang="en">
          <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <Meta />
            <Links />
          </head>
          <body>
              <Nav/>
              <Outlet context={{ supabase }} />
              <ScrollRestoration />
              <Scripts />
          </body>
        </html>
    </SupabaseContext.Provider>
  );
}
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
]

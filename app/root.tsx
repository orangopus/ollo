import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import "~/styles/styles.css";
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

  useEffect(() => {
    supabase.auth.getSession().then((session) => {client: { session  }})
  }, [])

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

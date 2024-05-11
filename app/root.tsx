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
import { redirect } from "@remix-run/node";
import { json } from '@remix-run/node' // change this import to whatever runtime you are using
import { User } from "@supabase/supabase-js";
import { UserContext } from "context/UserContext";
import Nav from "~/components/Nav";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  };

  const headers = new Headers()
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

  const { data } = await supabase.auth.getUser();

  return json({ env, user: data?.user });
}

export default function App() {
  const data = useLoaderData() as {
    env: {
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
    },
    user: User;
  };
  const supabase = createBrowserClient(data.env.SUPABASE_URL, data.env.SUPABASE_ANON_KEY);

  return (
    <SupabaseContext.Provider value={supabase}>
      <UserContext.Provider value={data.user}>
        <html lang="en">
          <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <Meta />
            <Links />
          </head>
          <body>
            <Nav/>
            <Outlet />
            <ScrollRestoration />
            <Scripts />
          </body>
        </html>
      </UserContext.Provider>
    </SupabaseContext.Provider>
  );
}
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
]

// app/routes/onboarding.jsx
import { Form, Outlet, useLoaderData, useOutletContext } from '@remix-run/react';
import supabase from 'utils/supabase';
import { SupabaseOutletContext } from '~/root';

import createServerSupabase from 'utils/supabase.server';
import { useState } from 'react';
import { LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
library.add(fab, fas);

export const loader: LoaderFunction = async ({ request }) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });

  const user = await supabase.auth.getUser();
  
  const profile = await supabase.from("profiles").select("*").eq("id", user.data.user.id)


  return {
    profile: profile.data,
    user: user.data
  }
};

export default function OnboardingLayout({params}: {params: YourParamsType}) {

  const { supabase } = useOutletContext<SupabaseOutletContext>();
  
  const profile = useLoaderData();
  const user = useLoaderData();
  const [username, setUsername] = useState(profile.username);

  const [hyperate, setHyperate] = useState(profile.heartbeat);

  const updateUsername = async (username) => {
    setUsername(username);
    await supabase // Use the Supabase client instead of the Supabase outlet context
      .from("profiles")
      .update({
        username,
      })
      .eq("id", user?.user.user.id); // Access the id property after awaiting the user promise
  };

  const updateHyperate = async (heartbeat) => {
    setHyperate(hyperate);
    await supabase // Use the Supabase client instead of the Supabase outlet context
      .from("profiles")
      .update({
        heartbeat,
      })
      .eq("id", user?.user.user.id); // Access the id property after awaiting the user promise
  };

  const handleSpotify = async () => {
    const {error} = await supabase.auth.signInWithOAuth({
      provider: 'spotify'
    })

    if (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen center">
      <h1>Dashboard</h1>
      <Outlet />
              <h2 className="edit center">Username</h2>
              <input
                autoFocus
                id="bio"
                name="bio"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                type="text"
                placeholder='Set username'
                defaultValue={profile.profile[0].username}
                className="input"
              /> 
              <button onClick={() => updateUsername(username)} className="button">Update</button>
              <h2>HypeRate</h2>
              <input
                id="hyperate"
                name="hyperate"
                value={hyperate}
                onChange={(event) => setHyperate(event.target.value)}
                type="text"
                placeholder='HypeRate ID'
                defaultValue={profile.profile[0].heartbeat}
                className="input"
              /> 

              <button onClick={() => updateHyperate(hyperate)} className="button">Update</button>
              <br/>
              <button onClick={handleSpotify} className="button bg-green-500 text-white"><FontAwesomeIcon icon={["fab", "spotify"]} /> Connect Spotify</button>

    </div>
  );
}
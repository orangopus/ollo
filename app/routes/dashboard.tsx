// app/routes/onboarding.jsx
import { Form, Link, Outlet, useLoaderData, useOutletContext } from '@remix-run/react';
import supabase from 'utils/supabase';
import { SupabaseOutletContext } from '~/root';

import createServerSupabase from 'utils/supabase.server';
import { useState } from 'react';
import { LoaderFunction, LoaderFunctionArgs, redirect } from '@remix-run/node';
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
  const [displayname, setDisplayName] = useState(profile.displayname);
  const [bio, setBio] = useState(profile.bio);
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

  const updateDisplayName = async (displayname) => {
    setDisplayName(displayname);
    await supabase // Use the Supabase client instead of the Supabase outlet context
      .from("profiles")
      .update({
        displayname,
      })
      .eq("id", user?.user.user.id); // Access the id property after awaiting the user promise
  };

  const updateBio = async (bio) => {
    setBio(bio);
    await supabase // Use the Supabase client instead of the Supabase outlet context
      .from("profiles")
      .update({
        bio,
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
      provider: 'spotify',
    });
    if (error) {
      console.error('Error logging in with Spotify:', error.message);
      return;
    }
  }

  return (
    <div className="min-h-screen center">
      <Outlet />
      <h2 className="edit center">Display name</h2>
              <input
                id="displayname"
                name="displayname"
                value={displayname}
                onChange={(event) => {
                  setDisplayName(event.target.value);
                  updateDisplayName(event.target.value);
                }}
                type="text"
                placeholder='Set display name'
                defaultValue={profile.profile[0].displayname}
                className="input"
              /> 
              <h2 className="edit center">Username</h2>
              <input
                id="username"
                name="username"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  updateUsername(event.target.value);
                }}
                type="text"
                placeholder='Set username'
                defaultValue={profile.profile[0].username}
                className="input"
              />
              <h2 className="edit center">Bio</h2>
              <textarea
                id="bio"
                name="bio"
                value={bio}
                onChange={(event) => {
                  setBio(event.target.value);
                  updateBio(event.target.value);
                }}
                placeholder='Set bio'
                defaultValue={profile.profile[0].bio}
                className="input bio"/>
              <h2 className="edit center">HypeRate</h2>
              <input
                id="hyperate"
                name="hyperate"
                value={hyperate}
                onChange={(event) => {
                  setHyperate(event.target.value);
                  updateHyperate(event.target.value);
                }}
                type="text"
                placeholder='HypeRate ID'
                defaultValue={profile.profile[0].heartbeat}
                className="input"
              /> 
              <br/>
              <Link to={`/${profile.profile[0].username}`}>
              <button className="button mb-5">View Profile</button>
              </Link>
              <br/>
              <button onClick={handleSpotify} className="button bg-green-500 text-white"><FontAwesomeIcon icon={["fab", "spotify"]} /> {profile.profile[0].spotify ? <span>Disconnect Spotify</span> : <span>Connect Spotify</span>}</button>

    </div>
  );
}
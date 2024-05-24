// app/routes/onboarding.jsx
import { Form, Link, Outlet, useLoaderData, useOutletContext } from '@remix-run/react';
import supabase from 'utils/supabase';
import { SupabaseOutletContext } from '~/root';
import {Dashboard} from '@uppy/react';
import Uppy from '@uppy/core';
import createServerSupabase from 'utils/supabase.server';
import { useEffect, useState } from 'react';
import { LoaderFunction, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditSocialItem from '~/components/editsocialitem';
import axios from "axios";
library.add(fab, fas);

export const loader: LoaderFunction = async ({ request }) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });

  const user = await supabase.auth.getUser();
  
  const profile = await supabase.from("profiles").select("*").eq("id", user?.data.user.id)

  return {
    profile: profile.data,
    user: user.data,
    env: {
      VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID,
      VERCEL_API_TOKEN: process.env.VERCEL_API_TOKEN
    }
  }
};

export default function OnboardingLayout({params, userId }: {params: YourParamsType}) {

  const { supabase } = useOutletContext<SupabaseOutletContext>();
  
  const profile = useLoaderData();
  const user = useLoaderData();
  const {env} = useLoaderData();
  const [username, setUsername] = useState(profile.username);
  const [displayname, setDisplayName] = useState(profile.displayname);
  const [bio, setBio] = useState(profile.bio);
  const [hyperate, setHyperate] = useState(profile.heartbeat);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [pally, setPally] = useState(profile.pally);

  const [customDomain, setCustomDomain] = useState(""); // State to manage custom domain input value
  const [error, setError] = useState(''); // State to manage error message

  const handleSubmit = async (event) => {
    event.preventDefault();  
      // Update user's profile with custom domain
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ custom_domain: customDomain })
        .eq('id', user.user.user.id);

      if (updateError) {
        throw updateError;
      }

      console.log('Custom Domain: ', customDomain);

      const domain = {
        name: customDomain
      }

      // Register custom domain with Vercel

    const response = await axios(`https://api.vercel.com/v10/projects/${env.VERCEL_PROJECT_ID}/domains?teamId=team_A8VB8liqd3xy1xyKgQCizpMW`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.VERCEL_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(domain) // Convert domain object to JSON string
    });

    console.log('Domain registered successfully!');
  };  


  const updateAvatar = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = user.user.user.id;
    const filePath = `public/avatars/${fileName}?updated`;

    try {
      let { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file, {
          cacheControl: '1000',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl }, error } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      if (error) {
        throw error;
      }

      setAvatarUrl(publicUrl);
      console.log('Avatar uploaded successfully:', publicUrl);
    } catch (error) {
      console.error('Error uploading avatar:', error.message);
    }
  };

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

  const updatePally = async (pally) => {
    setPally(pally);
    await supabase // Use the Supabase client instead of the Supabase outlet context
      .from("profiles")
      .update({
        pally,
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

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data, error } = await supabase
          .storage.from('uploads').getPublicUrl(`public/avatars/${user?.user.user.id}?updated`);

        if (error) {
          throw error;
        }

        if (data) {
          setAvatarUrl(data.publicUrl);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
      }
    };

    fetchUserProfile();
  }, [userId]);


  return (
    <div className="min-h-screen center">
      <Outlet />
      <div className="flex items-center center uploadcard mb-5">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
        {avatarUrl ? (
          <>
          <img src={avatarUrl} onChange={updateAvatar} alt="Profile" className="avatar object-cover" />
          </>
        ) : (
          <svg
            className="w-full h-full text-gray-500"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        )}
          <p className="my-5 text-sm text-gray-500 dark:text-gray-400">
            <span className="text-blue-500 dark:text-blue-400">Upload</span> your profile picture
            <p className="my-5 text-sm text-gray-500 dark:text-gray-400">Please note images are cached.</p>
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          onChange={updateAvatar}
          className="hidden"
        />
      </label>
    </div>
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
                className="input bio bio-h"/>
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
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">HypeRate feature is currently scheduled under maintainence due to websocket flooding.</p>
              <form onSubmit={handleSubmit}>
                  <h2 className="edit center">Custom Domain</h2>
                  <input
                    type="text"
                    className="input"
                    value={customDomain}
                    defaultValue={profile.profile[0].custom_domain}
                    onChange={(e) => e.target && setCustomDomain(e.target.value)}
                  />
                  <br/>
                  <code
    className="text-sm my-5 sm:text-base inline-flex text-left items-center space-x-4 bg-gray-800 text-white rounded-lg p-4 pl-6">
    <span className="flex gap-4">
        <span className="shrink-0 text-gray-500">
            A
        </span>

        <span className="flex-1">
            <span>
            76.76.21.21
            </span>
        </span>
    </span>
    </code>
    <br/>
                <button type="submit" className="button">Update</button>
                {error && <p className="text-red-500">{error}</p>} {/* Display error message if domain registration fails */}
              </form>
              <h2 className="edit center">Pally.gg</h2>
              <input
                id="pally"
                name="pally"
                value={pally}
                onChange={(event) => {
                  setPally(event.target.value);
                  updatePally(event.target.value);
                }}
                type="text"
                placeholder='Pally Username'
                defaultValue={profile.profile[0].pally}
                className="input"
              /> 
              <EditSocialItem />
              <br/>
              <Link to={`/${profile.profile[0].username}`}>
              <button className="button mb-5">View Profile</button>
              </Link>
              <br/>
              <button onClick={handleSpotify} className="button bg-green-500 text-white mb-10"><FontAwesomeIcon icon={["fab", "spotify"]} /> {profile.profile[0].spotify ? <span>Disconnect Spotify</span> : <span>Connect Spotify</span>}</button>

    </div>
  );
}

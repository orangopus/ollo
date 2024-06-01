import { Form, Link, Outlet, useLoaderData, useOutletContext } from '@remix-run/react';
import { SupabaseOutletContext } from '~/root';
import { startTransition, useEffect, useState, useTransition } from 'react';
import { LoaderFunction, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditSocialItem from '~/components/editsocialitem';
import axios from "axios";
import createServerSupabase from 'utils/supabase.server';
import Toast from '~/components/Toast';
import { useNotification } from 'context/NotificationContext';
import { json } from '@remix-run/node';
import supabase from 'utils/supabase.server';
library.add(fab, fas);

export const loader: LoaderFunction = async ({ request }) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });
  const user = await supabase.auth.getUser();
  
  if (!user) {
    throw redirect('/login');
  }

  const profileResponse = await supabase.from("profiles").select("*").eq("id", user.data.user.id).single();

  return json({
    profile: profileResponse.data,
    user: user.data,
    env: {
      VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID,
      VERCEL_API_TOKEN: process.env.VERCEL_API_TOKEN,
      SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
      SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI
    }
  });
};

export default function OnboardingLayout({ params, userId }: { params: any }) {
  const { supabase } = useOutletContext<SupabaseOutletContext>();
  const { profile, user, env} = useLoaderData();
  const { addNotification, removeNotification } = useNotification();

  const [username, setUsername] = useState(profile?.username || '');
  const [displayname, setDisplayName] = useState(profile?.displayname || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [hyperate, setHyperate] = useState(profile?.heartbeat || '');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [pally, setPally] = useState(profile?.pally || '');
  const [customDomain, setCustomDomain] = useState(profile?.custom_domain || '');
  const [error, setError] = useState('');
  const [lastNotificationTime, setLastNotificationTime] = useState(0);
  const [spotifyToken, setSpotifyToken] = useState('');

  const handleSpotify = () => {
    const clientId = env.SPOTIFY_CLIENT_ID;
    const redirectUri = env.SPOTIFY_REDIRECT_URI;
    const scopes = 'user-read-private user-read-email';
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = authUrl;
  };
5                                                                                                                                                                      
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await supabase
        .from('profiles')
        .update({ custom_domain: customDomain })
        .eq('id', user.user.id);

      const domain = { name: customDomain };

      await axios.post(
        `https://api.vercel.com/v10/projects/${env.VERCEL_PROJECT_ID}/domains?teamId=team_A8VB8liqd3xy1xyKgQCizpMW`,
        domain,
        {
          headers: {
            Authorization: `Bearer ${env.VERCEL_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      addNotification('Domain registered successfully!')
      console.log('Domain registered successfully!');
    } catch (updateError) {
      setError(updateError.message);
    }
  };

  const updateAvatar = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = user.user.id;
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
      addNotification('Avatar uploaded successfully!')
      console.log('Avatar uploaded successfully:', publicUrl);
    } catch (error) {
      console.error('Error uploading avatar:', error.message);
    }
  };

  const updateField = async (field, value) => {
    try {
      await removeNotification(field);
      await supabase
        .from('profiles')
        .update({ [field]: value })
        .eq('id', user.user.id);
      if (Date.now() - lastNotificationTime > 5000) {
        addNotification(`${field} updated successfully!`);
        setLastNotificationTime(Date.now());
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error.message);
    }
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data, error } = await supabase
          .storage.from('uploads')
          .getPublicUrl(`public/avatars/${user.user.id}?updated`);

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

    const fetchSpotifyData = async () => {
      try {
        const { data, error } = await supabase
          .from('spotify')
          .select('access_token')
          .eq('user_id', user.user.id)
          .single();

        if (data) {
          setSpotifyToken(data.access_token);
        } else {
          console.error('Error fetching Spotify token:', error.message);
        }
      } catch (error) {
        console.error('Error fetching Spotify token:', error.message);
      }
    };

    fetchUserProfile();
    fetchSpotifyData();
  }, [userId]);

  return (
    <div className="min-h-screen center">
      <Outlet />
      <div className="flex items-center center uploadcard mb-5">
        <Toast />
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" className="avatar object-cover" />
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
          updateField('displayname', event.target.value);
        }}
        type="text"
        placeholder='Set display name'
        className="input"
      />
      <h2 className="edit center">Username</h2>
      <input
        id="username"
        name="username"
        value={username}
        onChange={(event) => {
          setUsername(event.target.value);
          updateField('username', event.target.value);
        }}
        type="text"
        placeholder='Set username'
        className="input"
      />
      <h2 className="edit center">Bio</h2>
      <textarea
        id="bio"
        name="bio"
        value={bio}
        onChange={(event) => {
          setBio(event.target.value);
          updateField('bio', event.target.value);
        }}
        placeholder='Set bio'
        className="input bio-h"
      />
      <h2 className="edit center">HypeRate</h2>
      <input
        id="hyperate"
        name="hyperate"
        value={hyperate}
        onChange={(event) => {
          setHyperate(event.target.value);
          updateField('heartbeat', event.target.value);
        }}
        type="text"
        placeholder='HypeRate ID'
        className="input"
      />
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">HypeRate feature is currently scheduled under maintenance due to websocket flooding.</p>
      <form onSubmit={handleSubmit}>
        <h2 className="edit center">Custom Domain</h2>
        <input
          type="text"
          className="input"
          value={customDomain}
          onChange={(e) => setCustomDomain(e.target.value)}
        />
        <br />
        <code className="text-sm my-5 sm:text-base inline-flex text-left items-center space-x-4 bg-gray-800 text-white rounded-lg p-4 pl-6">
          <span className="flex gap-4">
            <span className="shrink-0 text-gray-500">
              A
            </span>
            <span className="flex-1">
              76.76.21.21
            </span>
          </span>
        </code>
        <br />
        <button type="submit" className="button">Update</button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
      <h2 className="edit center">Pally.gg</h2>
      <input
        id="pally"
        name="pally"
        value={pally}
        onChange={(event) => {
          setPally(event.target.value);
          updateField('pally', event.target.value);
        }}
        type="text"
        placeholder='Pally Username'
        className="input"
      />
      <EditSocialItem />
      <br />
      <Link to={`/${username}`}>
        <button className="button mb-5">View Profile</button>
      </Link>
      <br />
      <button onClick={handleSpotify} className="button">Connect Spotify</button>
    </div>
  );
}
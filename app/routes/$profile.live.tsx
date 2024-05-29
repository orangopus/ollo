// routes/$profile.live.tsx
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import createServerSupabase from 'utils/supabase.server';
import { getClient } from 'utils/getstream.server';
import { StreamChat, DefaultGenerics } from 'stream-chat';

export const loader = async ({ params, request }) => {

const response = new Response();
const { username } = params.profile;
const supabase = createServerSupabase({ request, response });
const client = getClient();
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  throw redirect('/login');
}

const profileResponse = await supabase.from("profiles").select("*").eq("id", user.id).single();
if (!profileResponse.data) {
  console.error('Profile not found for user:', user.id);
  throw new Error('Profile not found');
}

let { data: streamKeyData, error: streamKeyError } = await supabase.from("stream_keys").select("*").eq("user_id", profileResponse.data.id).single();
if (streamKeyError) {
  console.error('Error fetching stream key:', streamKeyError);
  streamKeyData = null;
}

if (!streamKeyData) {
  try {
    const key = client.createUserToken(user.id); // Generate a new GetStream key
    const { error: insertError } = await supabase.from("stream_keys").insert({ user_id: user.id, key }).single();
    if (insertError) {
      console.error('Error inserting stream key:', insertError);
      throw new Error('Error inserting stream key');
    }

    const newStreamKeyResponse = await supabase.from("stream_keys").select("*").eq("user_id", user.id).single();
    streamKeyData = newStreamKeyResponse.data;

  } catch (error) {
    console.error('Error during stream key creation or insertion:', error);
    throw new Error('Stream key creation or insertion failed');
  }
}

if (!streamKeyData || !streamKeyData.key) {
  throw new Error('Stream key not found or could not be created');
}

return json({
  profile: profileResponse.data,
  user,
  streamKey: streamKeyData.key,
  env: {
    VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID,
    VERCEL_API_TOKEN: process.env.VERCEL_API_TOKEN
  }
});
};

export default function ProfilePage() {
  const { profile, streamKey, feed } = useLoaderData();

  const embedUrl = `https://yourstreamingplatform.com/embed/${streamKey}`; // Replace with actual URL

  return (
    <div>
      <h1>{profile.displayname}</h1>
      <p>{profile.bio}</p>
      
      {streamKey ? (
        <div>
          <h2>Live Stream</h2>
          <iframe
            src={embedUrl}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Live Stream"
            width="100%"
            height="480"
          ></iframe>
        </div>
      ) : (
        <p>No live stream available.</p>
      )}

      <h2>Activity Feed</h2>
      {feed.length > 0 ? (
        <ul>
          {feed.map((item, index) => (
            <li key={index}>
              <p>{item.actor} {item.verb} {item.object}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No activities found.</p>
      )}
    </div>
  );
}

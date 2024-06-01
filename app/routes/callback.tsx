// routes/callback.jsx

import { redirect } from '@remix-run/node';
import { useEffect } from 'react';
import { useLoaderData, useNavigate } from '@remix-run/react';
import createServerSupabase from 'utils/supabase.server';

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code') || '';

const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
    },
    body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI || ''
    })
});

const tokenData = await tokenResponse.json();

const response = new Response();
const supabase = createServerSupabase({ request, response });
const { data: { user } } = await supabase.auth.getUser();

if (user) {
    await supabase.from('spotify').upsert({
        user_id: user.id,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: new Date(Date.now())
    });
}

  return tokenData;
};

export default function SpotifyCallback() {
  const navigate = useNavigate();
  const token = useLoaderData();

  return (
    JSON.stringify(token)
  );
}

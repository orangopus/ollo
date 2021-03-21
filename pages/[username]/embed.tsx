import Head from "next/head";
import { useState, useEffect } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../../utils/initSupabase";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import ImageFallback from "react-image-fallback";

dayjs.extend(relativeTime);
library.add(fab, fas);

import { useRouter } from "next/router";

export default function Embed({ profile }) {
  const router = useRouter();
  const { username } = router.query;
  if (!username) return null;

  return (
    <>
      <Head>
        <title>{profile.username}'s Embed | libby</title>
        <link rel="icon" type="image/png" href={profile.avatar}></link>
        <meta
          property="title"
          content={`${profile.username}'s Profile | libby`}
        />
        <meta property="description" content={`${profile.bio}`} />
        <meta
          property="url"
          content={`${window.location.host}/${profile.username}`}
        />
        <meta property="image" content={`${profile.avatar}`} />
      </Head>
      <div
        className="profilecont fullscreen"
        style={{ backgroundImage: `url(${profile.background_url})` }}
      >
        <div className="avatarcont">
          <img className="avatar center mb-10" src={profile.avatar} />
        </div>
        <div className="info marginone">
          <h1 className="username">
            {profile.displayname ? profile.displayname : profile.username}{" "}
            <span className="handle">@{profile.username}</span>
          </h1>
          <p></p>
          <p className="bio">{profile.bio}</p>
          <Link href={`https://libby.gg/${username}`}>
            <a target="_blank">
              <button className="button embedbutton">View libby profile</button>
            </a>
          </Link>
        </div>
        <style
          dangerouslySetInnerHTML={{
            __html: `
      .navbar {
        display: none;
      }

      footer {
        display: none;
      }
    `,
          }}
        />
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { body, error } = await supabase
    .from("profiles")
    .select("*")
    .ilike("username", context.params.username)
    .single();

  const posts = await supabase
    .from("vw_posts_with_user")
    .select()
    .ilike("username", context.params.username);

  if (!body) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      profile: body,
      posts: posts,
    }, // will be passed to the page component as props
  };
}

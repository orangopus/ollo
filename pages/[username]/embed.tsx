import Head from "next/head";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../../utils/initSupabase";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Markdown from "react-markdown";
import Link from "next/link";
import gfm from "remark-gfm";
import ReactTooltip from "react-tooltip";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import { url } from "inspector";
import axios from "axios";

dayjs.extend(relativeTime);
library.add(fab, fas);

import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const { username } = router.query;
  if (!username) return null;

  const [profile, setProfile] = useState("");

  useEffect(() => {
    // GET request using axios inside useEffect React hook
    axios
      .get(`//${window.location.host}/api/profile/${username}`)
      .then((response) => setProfile(response.data));

    // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, [profile]);

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
        className="flex profilecont fullscreen"
        style={{ backgroundImage: `url(${profile.background_url})` }}
      >
        <div className="avatarcont">
          <img className="avatar" src={profile.avatar} />
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
              <button className="button embedbutton">View profile</button>
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

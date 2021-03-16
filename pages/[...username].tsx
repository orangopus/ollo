import Head from "next/head";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../utils/initSupabase";
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

export default function UserPage({ profile, user, posts }) {
  if (profile.html === null) {
    profile.html = "";
  }

  const [glimeshHTML, setGlimeshHTML] = useState([]);
  const [glimeshTitle, setGlimeshTitle] = useState([]);
  const [glimeshCat, setGlimeshCat] = useState([]);
  const [glimeshTags, setGlimeshTags] = useState([]);
  const [glimeshThumb, setGlimeshThumb] = useState([]);
  const [glimeshStatus, setGlimeshStatus] = useState([]);

  let glimeshStatusChecker = glimeshStatus;

  let glimeshStats;

  if (glimeshStatusChecker === "LIVE") {
    glimeshStatusChecker = (
      <>
        <a
          className="none"
          href={`https://glimesh.tv/${profile.social.glimesh}`}
          target="_blank"
        >
          <span data-tip data-for="glimTitle" className="live">
            LIVE
          </span>
        </a>
        <ReactTooltip
          id="glimTitle"
          backgroundColor="#000"
          place="top"
          type="dark"
          effect="solid"
        >
          on Glimesh
        </ReactTooltip>
      </>
    );

    glimeshStats = (
      <a className="none" href={`https://glimesh.tv/${profile.social.glimesh}`}>
        <div className="cards flex cardGlimesh">
          <div>
            <img className="thumbnail" src={`${glimeshThumb}`} />
          </div>
          <div className="glimeshInfo">
            <h1 className="glimeshTitle">
              {glimeshStatusChecker}{" "}
              <span className="category">{glimeshCat}</span> {glimeshTitle}
            </h1>
            <div className="tagscont">
              {glimeshTags.map((tags) => (
                <span className="tags">{tags.name}</span>
              ))}
            </div>
          </div>
        </div>
      </a>
    );
  } else {
    glimeshStatusChecker = <></>;
  }

  async function getData() {
    axios({
      url: "https://corsanywhere12.herokuapp.com/https://glimesh.tv/api",
      method: "post",
      headers: {
        Authorization: `Client-ID 0096321eb6fdc5c33d664ecc7036e9629b9b957a4a787c9cac4df891ef39c224`,
      },
      data: {
        query: `{
        user(username: "${profile.social.glimesh}"){
          profileContentHtml,
          profileContentMd
        }
      }
        `,
      },
    }).then((result) => {
      setGlimeshHTML(result.data.data.user.profileContentMd);
    });

    axios({
      url: "https://corsanywhere12.herokuapp.com/https://glimesh.tv/api",
      method: "post",
      headers: {
        Authorization: `Client-ID 0096321eb6fdc5c33d664ecc7036e9629b9b957a4a787c9cac4df891ef39c224`,
      },
      data: {
        query: `{
      channel(username: "${profile.social.glimesh}"){
        status,
        title,
        category {
          name
        },
        tags {
          name
        },
        stream {
          countViewers,
          thumbnail,
          startedAt
        } 
      }
    }
        `,
      },
    }).then((result) => {
      setGlimeshStatus(result.data.data.channel.status);
      setGlimeshTitle(result.data.data.channel.title);
      setGlimeshCat(result.data.data.channel.category.name);
      setGlimeshTags(result.data.data.channel.tags);
      if (result.data.data.channel.stream) {
        setGlimeshThumb(result.data.data.channel.stream.thumbnail);
      } else {
        return null;
      }
    });
  }

  useEffect(() => {
    getData();
  }, []);

  let twitter = profile.social.twitter;

  if (twitter === null) {
    twitter = null;
  } else if (twitter) {
    twitter = (
      <>
        <a
          data-tip
          data-for="twitterTip"
          href={`https://twitter.com/${profile.social.twitter}`}
          target="_blank"
          className="social twitter"
        >
          <FontAwesomeIcon icon={["fab", "twitter"]} />
        </a>
        <ReactTooltip
          id="twitterTip"
          backgroundColor="#000"
          place="bottom"
          type="dark"
          effect="solid"
        >
          <TwitterTimelineEmbed
            sourceType="profile"
            screenName={profile.social.twitter}
            theme="dark"
            options={{ height: 400 }}
          />
        </ReactTooltip>
      </>
    );
  }

  let instagram = profile.social.instagram;

  if (instagram === null) {
    instagram = null;
  } else if (instagram) {
    instagram = (
      <>
        <a
          data-tip
          data-for="instagramTip"
          href={`https://instagram.com/${profile.social.instagram}`}
          target="_blank"
          className="social instagram"
        >
          <FontAwesomeIcon icon={["fab", "instagram"]} />
        </a>
        <ReactTooltip
          id="instagramTip"
          backgroundColor="#000"
          place="top"
          type="dark"
          effect="solid"
        >
          {profile.social.instagram}
        </ReactTooltip>
      </>
    );
  }

  let makerlog = profile.social.makerlog;

  if (makerlog === null) {
    makerlog = null;
  } else if (makerlog) {
    makerlog = (
      <>
        <a
          data-tip
          data-for="makerlogTip"
          href={`https://maker.to/${profile.social.makerlog}`}
          target="_blank"
          className="social makerlog"
        >
          <FontAwesomeIcon icon={["fas", "check-circle"]} />
        </a>
        <ReactTooltip
          id="makerlogTip"
          backgroundColor="#000"
          place="top"
          type="dark"
          effect="solid"
        >
          {profile.social.makerlog}
        </ReactTooltip>
      </>
    );
  }

  let github = profile.social.github;

  if (github === null) {
    github = null;
  } else if (github) {
    github = (
      <>
        <a
          data-tip
          data-for="githubTip"
          href={`https://github.com/${profile.social.github}`}
          target="_blank"
          className="social github"
        >
          <FontAwesomeIcon icon={["fab", "github"]} />
        </a>
        <ReactTooltip
          id="githubTip"
          backgroundColor="#000"
          place="top"
          type="dark"
          effect="solid"
        >
          {profile.social.github}
        </ReactTooltip>
      </>
    );
  }

  let sunshine = profile.social.sunshine;

  if (sunshine === null) {
    sunshine = null;
  } else if (sunshine) {
    sunshine = (
      <>
        <a
          data-tip
          data-for="sunshineTip"
          href={`https://sunshine.social/${profile.social.sunshine}`}
          target="_blank"
          className="social sunshine"
        >
          <img
            className="sunshine-img"
            src="https://sunshine.social/imgs/Sunshine_Social_Icon.png"
          />
        </a>
        <ReactTooltip
          id="sunshineTip"
          backgroundColor="#000"
          place="top"
          type="dark"
          effect="solid"
        >
          {profile.social.sunshine}
        </ReactTooltip>
      </>
    );
  }

  let glimesh = profile.social.glimesh;

  if (glimesh === null) {
    glimesh = null;
  } else if (glimesh) {
    glimesh = (
      <>
        <a
          data-tip
          data-for="glimeshTip"
          href={`https://glimesh.tv/${profile.social.glimesh}`}
          target="_blank"
          className="social glimesh"
        >
          <img
            className="glimesh-img"
            src="https://github.com/Glimesh/assets/blob/master/social/social-circle-middleish.png?raw=true"
          />
        </a>
        <ReactTooltip
          id="glimeshTip"
          backgroundColor="#000"
          place="top"
          type="dark"
          effect="solid"
        >
          {profile.social.glimesh}
        </ReactTooltip>
      </>
    );
  }

  let twitch = profile.social.twitch;

  if (twitch === null) {
    twitch = null;
  } else if (twitch) {
    twitch = (
      <>
        <a
          data-tip
          data-for="twitchTip"
          href={`https://twitch.tv/${profile.social.twitch}`}
          target="_blank"
          className="social twitch"
        >
          <FontAwesomeIcon icon={["fab", "twitch"]} />
        </a>
        <ReactTooltip
          id="twitchTip"
          backgroundColor="#000"
          place="top"
          type="dark"
          effect="solid"
        >
          {profile.social.twitch}
        </ReactTooltip>
      </>
    );
  }

  let guilded = profile.social.guilded;

  if (guilded === null) {
    guilded = null;
  } else if (guilded) {
    guilded = (
      <>
        <a
          data-tip
          data-for="guildedTip"
          href={`${profile.social.guilded}`}
          target="_blank"
          className="social guilded"
        >
          <FontAwesomeIcon icon={["fab", "guilded"]} />
        </a>
        <ReactTooltip
          id="guildedTip"
          backgroundColor="#000"
          place="top"
          type="dark"
          effect="solid"
        >
          {profile.social.guilded}
        </ReactTooltip>
      </>
    );
  }

  let discord = profile.social.discord;

  if (discord === null) {
    discord = null;
  } else if (discord) {
    discord = (
      <>
        <a
          data-tip
          data-for="discordTip"
          href={`${profile.social.discord}`}
          target="_blank"
          className="social discord"
        >
          <FontAwesomeIcon icon={["fab", "discord"]} />
        </a>
        <ReactTooltip
          id="discordTip"
          backgroundColor="#000"
          place="top"
          type="dark"
          effect="solid"
        >
          {profile.social.discord}
        </ReactTooltip>
      </>
    );
  }

  const formatDate = (date: string) => {
    return dayjs().to(dayjs(date));
  };

  let proChecker = profile.pro;

  if (proChecker === true) {
    proChecker = (
      <>
        <Link href="/pro">
          <span className="pro">PRO</span>
        </Link>
      </>
    );
  }

  let staffChecker = profile.staff;

  if (staffChecker === true) {
    staffChecker = (
      <>
        <span className="staff">STAFF</span>
      </>
    );
  }

  let modChecker = profile.mod;

  if (modChecker === true) {
    modChecker = (
      <>
        <span className="staff">MOD</span>
      </>
    );
  }

  let verifiedChecker = profile.verified;

  if (verifiedChecker === true || profile.social.twitter) {
    verifiedChecker = (
      <>
        <span className="verified">
          <FontAwesomeIcon icon={["fas", "check"]} />
        </span>
      </>
    );
  }

  if (profile.social === null) {
    profile.social = "";
  }

  return (
    <>
      <Head>
        <title>{profile.username} | libby</title>
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

      <div className="herocont padd userdetails">
        <div
          className="justify-center profilecont"
          style={{ backgroundImage: `url(${profile.background_url})` }}
        >
          <div className="center avatarcont">
            <img className="avatar center" src={profile.avatar} />
          </div>
          <div className="info mt-4">
            <h1 className="username">
              {profile.displayname ? profile.displayname : profile.username}{" "}
              <div>
                <span className="handle">@{profile.username}</span>
              </div>
              <div className="mt-3">
                {staffChecker} {modChecker} {verifiedChecker} {proChecker}{" "}
              </div>
            </h1>
            <p></p>
            <p className="bio">{profile.bio}</p>
          </div>
        </div>
        <div className="cards flex socialcont">
          <div className="socials">
            {twitter}
            {instagram}
            {github}
            {makerlog}
            {sunshine}
            {glimesh}
            {twitch}
            {guilded}
            {discord}
          </div>
        </div>
        <Tabs>
          <div className="flexsocial">
            <div>
              <TabList>
                <Tab>About</Tab>
                <Tab>Posts</Tab>
                <Tab>Schedule</Tab>
                <Tab>Donate</Tab>
              </TabList>
            </div>
            {glimeshStats}
          </div>
          <TabPanel>
            <div className="cards auto width">
              <Markdown
                plugins={[gfm]}
                children={profile.html}
                allowDangerousHtml={true}
              />
              <Markdown
                plugins={[gfm]}
                children={glimeshHTML}
                allowDangerousHtml={true}
              />
            </div>
          </TabPanel>
          <TabPanel>
            <div className="posts">
              {posts.data.map((post, index) => (
                <div className="cards cardspost">
                  <div className="flex">
                    <div className="avatarcont">
                      <a href={`/${post.username}`}>
                        <img className="avatar avatar2" src={post.avatar} />
                      </a>
                    </div>
                    <div className="info ml-4">
                      <h1 className="username mb-2 left">
                        {post.displayname ? post.displayname : post.username}{" "}
                        <span className="handle">@{post.username}</span>
                        <span className="minutesago">
                          {formatDate(post.published_at)}
                        </span>
                      </h1>

                      <p className="postcontent">
                        <Markdown plugins={[gfm]} children={post.content} />
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabPanel>
          <TabPanel>
            <div className="cards auto">
              <p>Schedule isn't available in this early alpha.</p>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="cards auto">
              <p>Donate isn't available in this early alpha.</p>
            </div>
          </TabPanel>
        </Tabs>
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
